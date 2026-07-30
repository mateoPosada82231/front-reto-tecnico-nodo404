import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../../shared/services/auth'
import { getFriendlyError } from '../../../shared/utils/errors'
import useContent from '../../../shared/hooks/useContent'

export default function useRegisterForm() {
  const navigate = useNavigate()
  const { content: validation } = useContent('validation.register')
  const { content: errorsContent } = useContent('errors.common')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    country: '',
    birthDate: '',
    identification: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }, [])

  const validate = useCallback(() => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = validation.name_required
    if (!form.email.trim()) newErrors.email = validation.email_required
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = validation.email_invalid
    if (!form.country) newErrors.country = validation.country_required
    if (!form.birthDate) newErrors.birthDate = validation.birthdate_required
    if (!form.identification.trim()) newErrors.identification = validation.id_required
    if (!form.phone.trim()) newErrors.phone = validation.phone_required
    if (!form.password) newErrors.password = validation.password_required
    else if (form.password.length < 8) newErrors.password = validation.password_min_length
    else if (!/[A-Z]/.test(form.password)) newErrors.password = validation.password_uppercase
    else if (!/[0-9]/.test(form.password)) newErrors.password = validation.password_number
    else if (!/[$@$!%*?&#]/.test(form.password)) newErrors.password = validation.password_special
    if (!form.confirmPassword) newErrors.confirmPassword = validation.confirm_required
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = validation.confirm_match
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
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        country: form.country,
        identification: form.identification,
        mobileNumber: form.phone,
        dateOfBirth: form.birthDate,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setServerError(getFriendlyError(errorsContent, err))
    } finally {
      setLoading(false)
    }
  }, [form, validate, navigate, errorsContent])

  return { form, errors, serverError, loading, success, handleChange, handleSubmit }
}
