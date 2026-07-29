import { useState, useEffect, useCallback } from 'react'
import useAuth from '../../shared/hooks/useAuth'
import { updateUser } from '../../shared/services/users'

const EDITABLE_FIELDS = ['fullName', 'country', 'identification', 'mobileNumber', 'dateOfBirth']

function buildFormState(user) {
  return EDITABLE_FIELDS.reduce((acc, field) => {
    acc[field] = user?.[field] ?? ''
    return acc
  }, {})
}

export default function useProfile() {
  const { user, email, loading, isLoggedIn } = useAuth()
  const [form, setForm] = useState(() => buildFormState(user))
  const [errors, setErrors] = useState({})
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (user) setForm(buildFormState(user))
  }, [user])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev))
  }, [])

  const validate = useCallback(() => {
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'El nombre es obligatorio'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [form])

  const startEditing = useCallback(() => {
    setFeedback(null)
    setEditing(true)
  }, [])

  const cancelEditing = useCallback(() => {
    setForm(buildFormState(user))
    setErrors({})
    setFeedback(null)
    setEditing(false)
  }, [user])

  const saveProfile = useCallback(async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setFeedback(null)
    try {
      await updateUser(email, form)
      window.dispatchEvent(new Event('token-changed'))
      setFeedback({ type: 'success', message: 'Perfil actualizado con éxito' })
      setEditing(false)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo actualizar el perfil' })
    } finally {
      setSaving(false)
    }
  }, [email, form, validate])

  return {
    user,
    email,
    loading,
    isLoggedIn,
    form,
    errors,
    editing,
    saving,
    feedback,
    handleChange,
    startEditing,
    cancelEditing,
    saveProfile,
  }
}