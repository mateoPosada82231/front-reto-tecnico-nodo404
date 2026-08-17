import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getUserByEmail } from '../services/users'
import { logout as logoutApi } from '../services/auth'
import { getUserBuys } from '../services/buys'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      user: null,
      loading: false,
      profileComplete: true,
      isBetaTester: false,
      isLoggedIn: false,
      avatarUrl: null,
      avatarHat: 'none',
      purchasedIds: [],
      purchasedItems: [], // array of { extensionId, platform, language }

      setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
      setAvatarHat: (avatarHat) => set({ avatarHat }),

      setUser: (user) => {
        set({
          user,
          profileComplete: user?.profileComplete ?? true,
          isBetaTester: user?.betaTester ?? false,
        })
      },

      setAuth: (token, email) => {
        set({ token, email, isLoggedIn: !!token })
        get().fetchUser()
        get().fetchPurchases()
      },

      fetchUser: async () => {
        const { email } = get()
        if (!email) {
          set({ user: null, profileComplete: true, isBetaTester: false, loading: false })
          return
        }
        set({ loading: true })
        try {
          const userData = await getUserByEmail(email)
          get().setUser(userData)
          await get().fetchPurchases()
        } catch {
          set({ user: null, profileComplete: true, isBetaTester: false })
        } finally {
          set({ loading: false })
        }
      },

      fetchPurchases: async () => {
        const { email } = get()
        if (!email) {
          set({ purchasedIds: [], purchasedItems: [] })
          return
        }
        try {
          const buys = await getUserBuys(email)
          if (Array.isArray(buys)) {
            const items = buys.map((b) => ({
              extensionId: b.extension?.id ?? b.extensionId,
              platform: b.platform || 'PC',
              language: b.language || 'Español',
            })).filter((i) => i.extensionId)

            const ids = items.map((i) => i.extensionId)
            set({ purchasedIds: ids, purchasedItems: items })
          } else {
            set({ purchasedIds: [], purchasedItems: [] })
          }
        } catch {
          set({ purchasedIds: [], purchasedItems: [] })
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
          isLoggedIn: false,
          purchasedIds: [],
          purchasedItems: [],
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
        avatarUrl: state.avatarUrl,
        avatarHat: state.avatarHat,
        purchasedIds: state.purchasedIds,
        purchasedItems: state.purchasedItems,
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
