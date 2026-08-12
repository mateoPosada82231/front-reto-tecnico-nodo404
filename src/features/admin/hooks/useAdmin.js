import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useContent from '../../../shared/hooks/useContent'
import { getFriendlyError } from '../../../shared/utils/errors'
import {
  getBetaUsers,
  getExtensionStats,
  broadcastBetaTesters,
  promoteToAdmin,
} from '../../../shared/services/admin'

export default function useAdmin() {
  const { isLoggedIn, isAdmin } = useAuthStore()
  const { content } = useContent('admin.page')
  const { content: errorsContent } = useContent('errors.common')

  const [tab, setTab] = useState('beta')
  const [betaUsers, setBetaUsers] = useState([])
  const [stats, setStats] = useState([])
  const [loadingBeta, setLoadingBeta] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [betaError, setBetaError] = useState(null)
  const [statsError, setStatsError] = useState(null)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastFeedback, setBroadcastFeedback] = useState(null)

  const [promoteEmail, setPromoteEmail] = useState('')
  const [promoting, setPromoting] = useState(false)
  const [promoteFeedback, setPromoteFeedback] = useState(null)

  const loadBetaUsers = useCallback(() => {
    setLoadingBeta(true)
    setBetaError(null)
    getBetaUsers()
      .then((result) => setBetaUsers(result))
      .catch((err) => setBetaError(getFriendlyError(errorsContent, err) || content.loading_error))
      .finally(() => setLoadingBeta(false))
  }, [errorsContent, content])

  const loadStats = useCallback(() => {
    setLoadingStats(true)
    setStatsError(null)
    getExtensionStats()
      .then((result) => setStats(result))
      .catch((err) => setStatsError(getFriendlyError(errorsContent, err) || content.loading_error))
      .finally(() => setLoadingStats(false))
  }, [errorsContent, content])

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      loadBetaUsers()
      loadStats()
    }
  }, [isLoggedIn, isAdmin, loadBetaUsers, loadStats])

  const handleBroadcast = useCallback(
    async (e) => {
      e?.preventDefault()
      setBroadcasting(true)
      setBroadcastFeedback(null)
      try {
        await broadcastBetaTesters(subject.trim(), body.trim())
        setBroadcastFeedback({ type: 'success', message: content.broadcast_success })
        setSubject('')
        setBody('')
      } catch (err) {
        setBroadcastFeedback({
          type: 'error',
          message: getFriendlyError(errorsContent, err) || content.broadcast_error,
        })
      } finally {
        setBroadcasting(false)
      }
    },
    [subject, body, content, errorsContent],
  )

  const handlePromote = useCallback(
    async (e) => {
      e?.preventDefault()
      if (!promoteEmail.trim()) return
      setPromoting(true)
      setPromoteFeedback(null)
      try {
        await promoteToAdmin(promoteEmail.trim())
        setPromoteFeedback({ type: 'success', message: content.promote_success })
        setPromoteEmail('')
      } catch (err) {
        setPromoteFeedback({
          type: 'error',
          message: getFriendlyError(errorsContent, err) || content.promote_error,
        })
      } finally {
        setPromoting(false)
      }
    },
    [promoteEmail, content, errorsContent],
  )

  return {
    isLoggedIn,
    isAdmin,
    content,
    tab,
    setTab,
    betaUsers,
    stats,
    loadingBeta,
    loadingStats,
    betaError,
    statsError,
    subject,
    setSubject,
    body,
    setBody,
    broadcasting,
    broadcastFeedback,
    handleBroadcast,
    promoteEmail,
    setPromoteEmail,
    promoting,
    promoteFeedback,
    handlePromote,
  }
}