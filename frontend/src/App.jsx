import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} /> : <Register />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/admin" 
          element={
            user && user.role === 'Admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user && user.role === 'User' ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App 