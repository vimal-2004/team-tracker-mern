const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'User' }).select('name email');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/notifications - Get current user's notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ notifications: user.notifications || [] });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/notifications/:index/read - mark a notification as read
router.patch('/notifications/:index/read', authenticateToken, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx)) return res.status(400).json({ message: 'Invalid index' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.notifications || !user.notifications[idx]) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    user.notifications[idx].read = true;
    await user.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 