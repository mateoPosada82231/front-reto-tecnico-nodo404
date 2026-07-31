import { create } from 'zustand'
import { register } from '../../../shared/services/auth'
import { getFriendlyError } from '../../../shared/utils/errors'
import useUsersStore from '../../../shared/stores/useUsersStore'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  country: '',
  birthDate: '',
  identification: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const useRegisterFormStore = create((set, get) => ({
  form: { ...INITIAL_FORM },
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
    if (!form.fullName.trim()) newErrors.fullName = validation.name_required
    if (!form.email.trim()) newErrors.email = validation.email_required
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = validation.email_invalid
    else if (useUsersStore.getState().isEmailRegistered(form.email))
      newErrors.email = validation.email_already_registered
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
  },

  handleSubmit: async (e, { validation, errorsContent, onSuccess } = {}) => {
    e.preventDefault()
    const { form, validate } = get()
    await useUsersStore.getState().loadEmails()
    const validationResult = validate(form, validation)
    if (Object.keys(validationResult).length > 0) {
      set({ errors: validationResult })
      return
    }

    set({ loading: true, serverError: '' })

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
      useUsersStore.getState().addEmail(form.email)
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
      form: { ...INITIAL_FORM },
      errors: {},
      serverError: '',
      loading: false,
      success: false,
    })
  },
}))

export default useRegisterFormStore
