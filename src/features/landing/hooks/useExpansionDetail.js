import { useState, useEffect } from 'react'
import { getExtensionById } from '../../../shared/services/extensions'
import { buyDirect } from '../../../shared/services/buys'
import useContent from '../../../shared/hooks/useContent'
import { getFriendlyError } from '../../../shared/utils/errors'

export default function useExpansionDetail(id, email) {
  const { content: detailContent } = useContent('landing.detail')
  const { content: errorsContent } = useContent('errors.common')

  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [buySuccess, setBuySuccess] = useState(false)
  const [buyError, setBuyError] = useState(null)
  const [buying, setBuying] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    setBuySuccess(false)
    setBuyError(null)
    setShowForm(false)

    getExtensionById(id)
      .then((result) => {
        if (!cancelled) setPack(result)
      })
      .catch((err) => {
        if (!cancelled) setError(getFriendlyError(errorsContent, err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id, errorsContent])

  async function submitBuy(formData) {
    setBuying(true)
    setBuyError(null)
    try {
      await buyDirect({
        email,
        extensionId: pack.id,
        paymentMethod: formData.paymentMethod,
        language: formData.language,
        platform: formData.platform,
      })
      setBuySuccess(true)
      setShowForm(false)
    } catch (err) {
      setBuyError(getFriendlyError(errorsContent, err))
    } finally {
      setBuying(false)
    }
  }

  function resetBuy() {
    setBuySuccess(false)
    setBuyError(null)
    setShowForm(false)
  }

  return {
    pack,
    loading,
    error,
    buySuccess,
    buyError,
    buying,
    showForm,
    setShowForm,
    submitBuy,
    resetBuy,
    detailContent,
  }
}
