import { useState } from 'react'
import { Edit, Trash2, Calendar, User, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useTask } from '../contexts/TaskContext'
import EditTaskModal from './EditTaskModal'

const TaskList = ({ tasks, loading, isAdmin, onTaskUpdate }) => {
  const { deleteTask } = useTask()
  const [editingTask, setEditingTask] = useState(null)

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        onTaskUpdate()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'status-todo'
      case 'In Progress':
        return 'status-progress'
      case 'Done':
        return 'status-done'
      default:
        return 'status-todo'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high'
      case 'Medium':
        return 'priority-medium'
      case 'Low':
        return 'priority-low'
      default:
        return 'priority-medium'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'To Do':
        return <Clock className="w-4 h-4" />
      case 'In Progress':
        return <AlertCircle className="w-4 h-4" />
      case 'Done':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Calendar className="h-16 w-16" />
        </div>
        <p className="empty-state-text">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task._id} className="card p-6 card-hover">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`status-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">{task.description}</p>
              
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Assigned to: {task.assignedTo?.name || 'Unknown'}</span>
                  </div>
                )}
                
                {task.createdBy && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Created by: {task.createdBy?.name || 'Unknown'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <button
                onClick={() => setEditingTask(task)}
                className="action-button"
                title="Edit task"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => handleDelete(task._id)}
                  className="action-button-danger"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={async (updatedTask) => {
            try {
              // Update task logic will be handled in EditTaskModal
              setEditingTask(null)
              onTaskUpdate()
            } catch (error) {
              console.error('Error updating task:', error)
            }
          }}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}

export default TaskList 