import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../../shared/services/auth'

export default function useRegisterForm() {
  const navigate = useNavigate()
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
    if (!form.fullName.trim()) newErrors.fullName = 'El nombre es obligatorio'
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio'
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = 'Correo inválido'
    if (!form.country) newErrors.country = 'Seleccione un país'
    if (!form.birthDate) newErrors.birthDate = 'Seleccione una fecha'
    if (!form.identification.trim()) newErrors.identification = 'Ingrese su identificación'
    if (!form.phone.trim()) newErrors.phone = 'Ingrese su celular'
    if (!form.password) newErrors.password = 'Ingrese una contraseña'
    else if (form.password.length < 8) newErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Debe contener al menos una mayúscula'
    else if (!/[0-9]/.test(form.password)) newErrors.password = 'Debe contener al menos un número'
    else if (!/[$@$!%*?&#]/.test(form.password)) newErrors.password = 'Debe contener al menos un carácter especial'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirme su contraseña'
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }, [form, validate, navigate])

  return { form, errors, serverError, loading, success, handleChange, handleSubmit }
}
