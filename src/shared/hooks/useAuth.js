import { useState, useEffect, useCallback } from 'react'
import { getUserByEmail } from '../services/users'
import { logout as logoutApi } from '../services/auth'

function getStoredAuth() {
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('userEmail')
  return { token, email }
}

export default function useAuth() {
  const [auth, setAuth] = useState(getStoredAuth)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(true)

  const fetchAuthData = useCallback(() => {
    const { token, email } = getStoredAuth()
    setAuth({ token, email })

    if (!token || !email) {
      setUser(null)
      setProfileComplete(true)
      setLoading(false)
      return
    }

    setLoading(true)
    getUserByEmail(email)
      .then((userData) => {
        setUser(userData)
        setProfileComplete(userData?.profileComplete ?? true)
      })
      .catch(() => {
        setUser(null)
        setProfileComplete(true)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAuthData() }, [fetchAuthData])

  useEffect(() => {
    const handler = () => fetchAuthData()
    window.addEventListener('token-changed', handler)
    return () => window.removeEventListener('token-changed', handler)
  }, [fetchAuthData])

  const logout = useCallback(() => {
    logoutApi().catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setAuth({ token: null, email: null })
    setUser(null)
    setProfileComplete(true)
  }, [])

  const isBetaTester = user?.betaTester ?? false

  return { user, email: auth.email, isBetaTester, profileComplete, isLoggedIn: !!auth.token, loading, logout }
}
