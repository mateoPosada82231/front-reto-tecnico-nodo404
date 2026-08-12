import { create } from 'zustand'

const useBetaModalStore = create((set) => ({
  isOpen: false,
  loading: false,
  success: false,
  error: null,

  open: () => set({ isOpen: true, success: false, error: null }),
  close: () => set({ isOpen: false, success: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setSuccess: (success) => set({ success }),
  setError: (error) => set({ error }),
}))

export default useBetaModalStore
