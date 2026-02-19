import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTask } from '../contexts/TaskContext'
import { LogOut, Plus, Filter, Search, Users, Calendar, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react'
import TaskList from '../components/TaskList'
import CreateTaskModal from '../components/CreateTaskModal'
import axios from 'axios'
import DarkModeToggle from '../components/DarkModeToggle';
import UserCard from '../components/UserCard';

const DashboardBackground = () => (
  <div className="absolute inset-0 -z-10">
    <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.10" />
        </linearGradient>
      </defs>
      <ellipse cx="720" cy="300" rx="900" ry="300" fill="url(#bg-gradient)" />
      <ellipse cx="300" cy="100" rx="200" ry="80" fill="#818cf8" fillOpacity="0.08" />
      <ellipse cx="1200" cy="500" rx="180" ry="60" fill="#60a5fa" fillOpacity="0.07" />
    </svg>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, loading, getAllTasks, createTask } = useTask()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: ''
  })
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [filters])

  const fetchTasks = async () => {
    try {
      await getAllTasks(filters)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData)
      setShowCreateModal(false)
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
    highPriority: tasks.filter(t => t.priority === 'High').length
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      <DashboardBackground />
      {/* Enhanced Header */}
      <header className="header-gradient shadow-lg relative overflow-hidden rounded-b-3xl mb-8">
        {/* SVG Illustration */}
        <svg className="absolute top-0 right-0 w-48 h-32 opacity-40 pointer-events-none" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 Q100 100 200 0 V100 H0 V0Z" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="page-title text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg dark:text-gray-300">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <button
                onClick={logout}
                className="btn-secondary flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="stats-card fade-in-up scale-hover" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="icon-container">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="stats-card fade-in-up scale-hover" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="icon-container-yellow">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todo}</p>
              </div>
            </div>
          </div>
          <div className="stats-card fade-in-up scale-hover" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className="icon-container">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="stats-card fade-in-up scale-hover" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center">
              <div className="icon-container-green">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.done}</p>
              </div>
            </div>
          </div>
          <div className="stats-card fade-in-up scale-hover" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center">
              <div className="icon-container-red">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highPriority}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Users Section */}
        <div className="mb-16 fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Users className="w-7 h-7 text-blue-500" /> Team Members
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {users.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-300 fade-in-up" style={{ animationDelay: '0.9s' }}>No users found.</div>
            ) : (
              users.map((user, idx) => (
                <div className="fade-in-up scale-hover" style={{ animationDelay: `${1 + idx * 0.1}s` }} key={user._id}>
                  <UserCard user={user} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-80"
              />
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="filter-select"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="filter-select"
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task List */}
        <TaskList 
          tasks={filteredTasks} 
          loading={loading}
          isAdmin={true}
          onTaskUpdate={fetchTasks}
        />
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          users={users}
        />
      )}
    </div>
  )
}

export default AdminDashboard 