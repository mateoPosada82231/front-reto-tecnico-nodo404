import { useState, useCallback } from 'react'
import { login } from '../../../shared/services/auth'
import { getFriendlyError } from '../../../shared/utils/errors'
import useContent from '../../../shared/hooks/useContent'

export default function useLoginForm({ onSuccess } = {}) {
  const { content: validation } = useContent('validation.login')
  const { content: errorsContent } = useContent('errors.common')
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }, [])

  const validate = useCallback(() => {
    const newErrors = {}
    if (!form.email.trim()) newErrors.email = validation.email_required
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = validation.email_invalid
    if (!form.password) newErrors.password = validation.password_required
    return newErrors
  }, [form, validation])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const validationResult = validate()
    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const data = await login(form.email, form.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userEmail', form.email)
      window.dispatchEvent(new CustomEvent('token-changed'))
      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      setServerError(getFriendlyError(errorsContent, err))
    } finally {
      setLoading(false)
    }
  }, [form, validate, onSuccess, errorsContent])

  return { form, errors, serverError, loading, success, handleChange, handleSubmit }
}
