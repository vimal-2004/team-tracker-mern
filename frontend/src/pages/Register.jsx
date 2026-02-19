import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Eye, EyeOff, User, Shield, UserPlus } from 'lucide-react'

const Register = () => {
  const [activeTab, setActiveTab] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { theme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    try {
      await register(formData.name, formData.email, formData.password, activeTab)
    } catch (error) {
      console.error('Registration error:', error)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="form-container">
        <div className="text-center">
          {/* SVG Illustration */}
          <div className="flex justify-center mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="40" rx="40" ry="40" fill="url(#registerGradient)" fillOpacity="0.3" />
              <g>
                <path d="M40 50c-6.627 0-12-5.373-12-12v-4a12 12 0 1124 0v4c0 6.627-5.373 12-12 12z" fill="#34d399" />
                <circle cx="40" cy="32" r="6" fill="#059669" />
                <rect x="54" y="28" width="10" height="4" rx="2" fill="#34d399" />
                <rect x="58" y="24" width="4" height="12" rx="2" fill="#34d399" />
              </g>
              <defs>
                <linearGradient id="registerGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="page-title mb-2 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Join Team Task Tracker
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
            User Account
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
            Admin Account
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-success w-full flex justify-center py-4 text-lg"
            >
              {loading ? (
                <div className="loading-spinner h-6 w-6"></div>
              ) : (
                `Create ${activeTab === 'admin' ? 'Admin' : 'User'} Account`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 