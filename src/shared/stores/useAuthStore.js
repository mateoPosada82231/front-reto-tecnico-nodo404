import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getUserByEmail } from '../services/users'
import { logout as logoutApi } from '../services/auth'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      user: null,
      loading: false,
      profileComplete: true,
      isBetaTester: false,
      isAdmin: false,
      isLoggedIn: false,

      setUser: (user) => {
        set({
          user,
          profileComplete: user?.profileComplete ?? true,
          isBetaTester: user?.betaTester ?? false,
          isAdmin: user?.admin ?? false,
        })
      },

      setAuth: (token, email) => {
        set({ token, email, isLoggedIn: !!token })
        get().fetchUser()
      },

      fetchUser: async () => {
        const { email } = get()
        if (!email) {
          set({ user: null, profileComplete: true, isBetaTester: false, isAdmin: false, loading: false })
          return
        }
        set({ loading: true })
        try {
          const userData = await getUserByEmail(email)
          get().setUser(userData)
        } catch {
          set({ user: null, profileComplete: true, isBetaTester: false, isAdmin: false })
        } finally {
          set({ loading: false })
        }
      },

      logout: () => {
        logoutApi().catch(() => {})
        set({
          token: null,
          email: null,
          user: null,
          loading: false,
          profileComplete: true,
          isBetaTester: false,
          isAdmin: false,
          isLoggedIn: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        email: state.email,
        user: state.user,
        profileComplete: state.profileComplete,
        isBetaTester: state.isBetaTester,
        isAdmin: state.isAdmin,
      }),
      merge: (persisted, current) => {
        const p = persisted || {}
        return {
          ...current,
          ...p,
          isLoggedIn: !!p.token,
        }
      },
    },
  ),
)

export default useAuthStore
