import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MagicLogin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { magicLogin } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login')
      return
    }

    const doMagic = async () => {
      try {
        await magicLogin(token)
        navigate('/dashboard')
      } catch (err) {
        navigate('/login')
      }
    }

    doMagic()
  }, [])

  return <div>Logging in...</div>
}

export default MagicLogin
