const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticateToken, requireAdmin, canAccessTask } = require('../middleware/auth');
// Add nodemailer and dotenv
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('assignedTo').isMongoId().withMessage('Valid user ID is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
];

const validateTaskUpdate = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('assignedTo').optional().isMongoId().withMessage('Valid user ID is required'),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Status must be To Do, In Progress, or Done'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required')
];

// POST /api/tasks - Create task (Admin only)
router.post('/', authenticateToken, requireAdmin, validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignedTo, priority, dueDate } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      priority,
      dueDate: new Date(dueDate),
      createdBy: req.user._id
    });

    await task.save();

    // Populate assigned user details
    await task.populate('assignedTo', 'name email');

    // Send email notification to assigned user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Team Task Tracker <${process.env.EMAIL_USER}>`,
      to: assignedUser.email,
      subject: 'You have been assigned a new task',
      html: `<h3>Hello ${assignedUser.name},</h3>
        <p>You have been assigned a new task:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Description:</strong> ${description}</li>
          <li><strong>Priority:</strong> ${priority}</li>
          <li><strong>Due Date:</strong> ${new Date(dueDate).toLocaleString()}</li>
        </ul>
        <p>Please log in to your account to view and manage this task.</p>
        <br/>
        <p>Best regards,<br/>Team Task Tracker</p>`
    };

    // Send the email (do not block response if it fails)
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending assignment email:', err);
      } else {
        console.log('Assignment email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks - Get all tasks (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, assignedTo, priority } = req.query;
    const filter = {};

    // Apply filters
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/my - Get user's tasks
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { assignedTo: req.user._id };

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', authenticateToken, canAccessTask, validateTaskUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignedTo, status, priority, dueDate } = req.body;
    const updateData = {};

    // Only admin can change assignment and all fields
    if (req.user.role === 'Admin') {
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (assignedTo) {
        // Check if assigned user exists
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        updateData.assignedTo = assignedTo;
      }
      if (priority) updateData.priority = priority;
      if (dueDate) updateData.dueDate = new Date(dueDate);
    }

    // Both admin and assigned user can update status
    if (status) updateData.status = status;

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email').populate('createdBy', 'name');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id - Delete task (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', authenticateToken, canAccessTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json({ task });
  } catch (error) {
    console.error('Get single task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 