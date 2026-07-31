import { create } from 'zustand'
import { get as httpGet } from '../services/httpClient'

const useUsersStore = create((set, get) => ({
  emails: [],
  loaded: false,
  loading: false,

  loadEmails: async () => {
    if (get().loaded || get().loading) return
    set({ loading: true })
    try {
      const data = await httpGet('/api/auth/emails')
      set({ emails: Array.isArray(data) ? data : [], loaded: true })
    } catch {
      set({ emails: [], loaded: true })
    } finally {
      set({ loading: false })
    }
  },

  isEmailRegistered: (email) => {
    const { emails } = get()
    if (!email) return false
    return emails.some(
      (e) => e.toLowerCase() === email.toLowerCase().trim(),
    )
  },

  addEmail: (email) => {
    if (!email) return
    set((state) => ({ emails: [...state.emails, email] }))
  },

  reset: () => set({ emails: [], loaded: false, loading: false }),
}))

export default useUsersStore
