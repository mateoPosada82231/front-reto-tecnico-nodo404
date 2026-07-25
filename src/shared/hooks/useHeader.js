import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import useTheme from './useTheme'
import { updateUser } from '../services/users'

export default function useHeader() {
  const navigate = useNavigate()
  const { user, email, isBetaTester, profileComplete, isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [betaLoading, setBetaLoading] = useState(false)
  const [betaSuccess, setBetaSuccess] = useState(false)
  const [betaError, setBetaError] = useState(null)

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

  const openModal = useCallback(() => {
    setModalOpen(true)
    setBetaSuccess(false)
    setBetaError(null)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setBetaSuccess(false)
    setBetaError(null)
  }, [])

  const becomeBetaTester = useCallback(async () => {
    console.log('becomeBetaTester called', { email, user })
    if (!email || !user) {
      console.warn('becomeBetaTester: early return - missing email or user')
      return
    }
    setBetaLoading(true)
    setBetaError(null)
    try {
      const body = { ...user, betaTester: true }
      console.log('PUT body:', body)
      await updateUser(email, body)
      setBetaSuccess(true)
      window.dispatchEvent(new Event('token-changed'))
    } catch (err) {
      console.error('becomeBetaTester error:', err)
      setBetaError(err.message || 'Error al actualizar')
    } finally {
      setBetaLoading(false)
    }
  }, [email, user])

  const showBetaButton = isLoggedIn && !isBetaTester

  return {
    user,
    email,
    isBetaTester,
    profileComplete,
    isLoggedIn,
    mobileOpen,
    modalOpen,
    betaLoading,
    betaSuccess,
    betaError,
    showBetaButton,
    theme,
    toggleTheme,
    handleLogout,
    toggleMobile,
    closeMobile,
    openModal,
    closeModal,
    becomeBetaTester,
  }
}
