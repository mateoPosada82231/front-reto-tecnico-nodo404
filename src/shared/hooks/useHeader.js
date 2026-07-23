import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import useTheme from './useTheme'
import { getBetaTesters } from '../services/betaTesters'

export default function useHeader() {
  const navigate = useNavigate()
  const { user, email, isBetaTester, isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [betaCount, setBetaCount] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const fetchCount = useCallback(() => {
    getBetaTesters()
      .then((data) => setBetaCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setBetaCount(null))
  }, [])

  useEffect(() => { fetchCount() }, [fetchCount])

  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener('beta-tester-registered', handler)
    return () => window.removeEventListener('beta-tester-registered', handler)
  }, [fetchCount])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }, [logout, navigate])

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const showBetaButton = !isLoggedIn || !isBetaTester

  return {
    user,
    email,
    isBetaTester,
    isLoggedIn,
    betaCount,
    mobileOpen,
    showBetaButton,
    theme,
    toggleTheme,
    handleLogout,
    toggleMobile,
    closeMobile,
  }
}
