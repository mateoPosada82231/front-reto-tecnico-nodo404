import { create } from 'zustand'
import { login } from '../../../shared/services/auth'
import { getFriendlyError } from '../../../shared/utils/errors'
import useAuthStore from '../../../shared/stores/useAuthStore'

const useLoginFormStore = create((set, get) => ({
  form: { email: '', password: '' },
  errors: {},
  serverError: '',
  loading: false,
  success: false,

  handleChange: (e) => {
    const { name, value } = e.target
    set((state) => ({
      form: { ...state.form, [name]: value },
      errors: { ...state.errors, [name]: '' },
      serverError: '',
    }))
  },

  validate: (form, validation) => {
    const newErrors = {}
    if (!form.email.trim()) newErrors.email = validation.email_required
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = validation.email_invalid
    if (!form.password) newErrors.password = validation.password_required
    return newErrors
  },

  handleSubmit: async (e, { validation, errorsContent, onSuccess } = {}) => {
    e.preventDefault()
    const { form, validate } = get()
    const validationResult = validate(form, validation)
    if (Object.keys(validationResult).length > 0) {
      set({ errors: validationResult })
      return
    }

    set({ loading: true, serverError: '' })

    try {
      const data = await login(form.email, form.password)
      if (!data?.token) throw new Error('Token no recibido')
      useAuthStore.getState().setAuth(data.token, form.email)
      set({ success: true })
      if (onSuccess) onSuccess()
    } catch (err) {
      set({ serverError: getFriendlyError(errorsContent, err), success: false })
    } finally {
      set({ loading: false })
    }
  },

  reset: () => {
    set({
      form: { email: '', password: '' },
      errors: {},
      serverError: '',
      loading: false,
      success: false,
    })
  },
}))

export default useLoginFormStore
