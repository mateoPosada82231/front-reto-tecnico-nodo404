import { useState, useCallback } from 'react'
import { changePassword } from '../../../shared/services/users'
import { getFriendlyError } from '../../../shared/utils/errors'
import useAuthStore from '../../../shared/stores/useAuthStore'

const INITIAL_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const VALIDATION_MESSAGES = {
  current_required: 'Ingrese su contraseña actual',
  password_required: 'Ingrese una contraseña',
  password_min_length: 'La contraseña debe tener mínimo 8 caracteres',
  password_uppercase: 'Debe contener al menos una mayúscula',
  password_number: 'Debe contener al menos un número',
  password_special: 'Debe contener al menos un carácter especial',
  confirm_required: 'Confirme su contraseña',
  confirm_match: 'Las contraseñas no coinciden',
}

function validatePassword(value, messages) {
  if (!value) return messages.password_required
  if (value.length < 8) return messages.password_min_length
  if (!/[A-Z]/.test(value)) return messages.password_uppercase
  if (!/[0-9]/.test(value)) return messages.password_number
  if (!/[$@$!%*?&#]/.test(value)) return messages.password_special
  return ''
}

function validate(form) {
  const errors = {}
  if (!form.currentPassword) errors.currentPassword = VALIDATION_MESSAGES.current_required
  errors.newPassword = validatePassword(form.newPassword, VALIDATION_MESSAGES)
  if (!form.confirmPassword) errors.confirmPassword = VALIDATION_MESSAGES.confirm_required
  else if (form.newPassword !== form.confirmPassword) errors.confirmPassword = VALIDATION_MESSAGES.confirm_match
  return errors
}

export default function useChangePassword() {
  const { email } = useAuthStore()
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const reset = useCallback(() => {
    setForm({ ...INITIAL_FORM })
    setErrors({})
    setFeedback(null)
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev))
    setFeedback(null)
  }, [])

  const close = useCallback(() => {
    reset()
  }, [reset])

  const submit = useCallback(
    async (errorsContent) => {
      const validationResult = validate(form)
      if (Object.values(validationResult).some(Boolean)) {
        setErrors(validationResult)
        return false
      }

      setLoading(true)
      setFeedback(null)
      try {
        await changePassword({
          email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
        setFeedback({ type: 'success', message: 'Contraseña cambiada correctamente.' })
        setForm({ ...INITIAL_FORM })
        return true
      } catch (err) {
        setFeedback({
          type: 'error',
          message: getFriendlyError(errorsContent, err) || err?.message || 'Error al cambiar la contraseña.',
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [email, form],
  )

  return {
    form,
    errors,
    loading,
    feedback,
    handleChange,
    submit,
    close,
    reset,
  }
}
