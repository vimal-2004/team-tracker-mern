import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Bell } from 'lucide-react'

const Notifications = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const ref = useRef()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/users/notifications')
        setNotifications(res.data.notifications || [])
      } catch (err) {
        console.error('Error fetching notifications', err)
      }
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const openNotification = async (n, idx) => {
    try {
      // Mark as read
      await axios.patch(`/api/users/notifications/${idx}/read`)
      // Navigate to link (relative to frontend)
      const base = window.location.origin
      window.location.href = `${base}${n.link}`
    } catch (err) {
      console.error('Error opening notification', err)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <Bell className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
          <div className="p-3 border-b font-semibold">Notifications</div>
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && <div className="p-3 text-sm text-gray-500">No notifications</div>}
            {notifications.map((n, i) => (
              <div key={i} className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${n.read ? 'opacity-60' : ''}`} onClick={() => openNotification(n, i)}>
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
