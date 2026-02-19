import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  // Get all tasks (Admin only)
  const getAllTasks = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams(filters)
      const response = await axios.get(`/api/tasks?${params}`)
      setTasks(response.data.tasks)
      return response.data.tasks
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get user's tasks
  const getUserTasks = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams(filters)
      const response = await axios.get(`/api/tasks/my?${params}`)
      setTasks(response.data.tasks)
      return response.data.tasks
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Create task (Admin only)
  const createTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData)
      setTasks(prev => [response.data.task, ...prev])
      toast.success('Task created successfully')
      return response.data.task
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task'
      toast.error(message)
      throw error
    }
  }

  // Update task
  const updateTask = async (taskId, updateData) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updateData)
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? response.data.task : task
        )
      )
      toast.success('Task updated successfully')
      return response.data.task
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task'
      toast.error(message)
      console.error('Update task error:', error.response?.data || error)
      throw error
    }
  }

  // Delete task (Admin only)
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`)
      setTasks(prev => prev.filter(task => task._id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task'
      toast.error(message)
      throw error
    }
  }

  // Get single task
  const getTask = async (taskId) => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`)
      return response.data.task
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task'
      toast.error(message)
      throw error
    }
  }

  const value = {
    tasks,
    loading,
    getAllTasks,
    getUserTasks,
    createTask,
    updateTask,
    deleteTask,
    getTask
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}
 