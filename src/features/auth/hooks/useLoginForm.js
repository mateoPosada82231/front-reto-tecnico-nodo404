import { useState, useCallback } from 'react'
import { login } from '../../../shared/services/auth'

export default function useLoginForm({ onSuccess } = {}) {
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
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio'
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = 'Correo inválido'
    if (!form.password) newErrors.password = 'Ingrese una contraseña'
    return newErrors
  }, [form])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
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
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }, [form, validate, onSuccess])

  return { form, errors, serverError, loading, success, handleChange, handleSubmit }
}
