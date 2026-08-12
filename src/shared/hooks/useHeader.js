import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import useBetaModalStore from '../stores/useBetaModalStore'
import useTheme from './useTheme'
import useContent from './useContent'
import { getFriendlyError } from '../utils/errors'
import { updateUser } from '../services/users'

export default function useHeader() {
  const navigate = useNavigate()
  const { user, email, isBetaTester, profileComplete, isLoggedIn } = useAuthStore()
  const {
    isOpen: modalOpen,
    loading: betaLoading,
    success: betaSuccess,
    error: betaError,
    open: openModal,
    close: closeModal,
    setLoading: setBetaLoading,
    setSuccess: setBetaSuccess,
    setError: setBetaError,
  } = useBetaModalStore()
  const { theme, toggleTheme } = useTheme()
  const { content: errorsContent } = useContent('errors.common')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = useCallback(() => {
    useAuthStore.getState().logout()
    navigate('/')
    setMobileOpen(false)
  }, [navigate])

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const becomeBetaTester = useCallback(async () => {
    if (!email || !user) return
    setBetaLoading(true)
    setBetaError(null)
    try {
      const body = { ...user, betaTester: true }
      await updateUser(email, body)
      setBetaSuccess(true)
      useAuthStore.getState().fetchUser()
    } catch (err) {
      setBetaError(getFriendlyError(errorsContent, err))
    } finally {
      setBetaLoading(false)
    }
  }, [email, user, errorsContent, setBetaLoading, setBetaError, setBetaSuccess])

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
