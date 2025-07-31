import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, User, Shield, CheckCircle } from 'lucide-react'

const Login = () => {
  const [activeTab, setActiveTab] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData.email, formData.password, activeTab)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="text-center">
          {/* SVG Illustration */}
          <div className="flex justify-center mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="40" rx="40" ry="40" fill="url(#loginGradient)" fillOpacity="0.3" />
              <g>
                <path d="M40 50c-6.627 0-12-5.373-12-12v-4a12 12 0 1124 0v4c0 6.627-5.373 12-12 12z" fill="#60a5fa" />
                <circle cx="40" cy="32" r="6" fill="#2563eb" />
              </g>
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="page-title mb-2">
            Team Task Tracker
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('user')}
            className={`tab-button ${
              activeTab === 'user'
                ? 'tab-button-active'
                : 'tab-button-inactive'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            User Login
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`tab-button ${
              activeTab === 'admin'
                ? 'tab-button-active'
                : 'tab-button-inactive'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-4 text-lg"
            >
              {loading ? (
                <div className="loading-spinner h-6 w-6"></div>
              ) : (
                `Sign in as ${activeTab === 'admin' ? 'Admin' : 'User'}`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 