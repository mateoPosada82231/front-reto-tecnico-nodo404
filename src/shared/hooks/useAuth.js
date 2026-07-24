import { useState, useEffect, useCallback } from 'react'
import { getUserByEmail } from '../services/users'
import { getBetaTesterByEmail } from '../services/betaTesters'
import { logout as logoutApi } from '../services/auth'

function getStoredAuth() {
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('userEmail')
  return { token, email }
}

export default function useAuth() {
  const [auth, setAuth] = useState(getStoredAuth)
  const [user, setUser] = useState(null)
  const [isBetaTester, setIsBetaTester] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(true)

  const fetchAuthData = useCallback(() => {
    const { token, email } = getStoredAuth()
    setAuth({ token, email })

    if (!token || !email) {
      setUser(null)
      setIsBetaTester(false)
      setProfileComplete(true)
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.allSettled([
      getUserByEmail(email).catch(() => null),
      getBetaTesterByEmail(email).then(() => true).catch(() => false),
    ]).then(([userResult, betaResult]) => {
      const userData = userResult.status === 'fulfilled' ? userResult.value : null
      setUser(userData)
      setIsBetaTester(betaResult.status === 'fulfilled' ? betaResult.value : false)
      setProfileComplete(userData?.profileComplete ?? true)
      setLoading(false)
    })
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
    setIsBetaTester(false)
    setProfileComplete(true)
  }, [])

  return { user, email: auth.email, isBetaTester, profileComplete, isLoggedIn: !!auth.token, loading, logout }
}
