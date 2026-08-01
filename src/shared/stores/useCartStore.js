import { create } from 'zustand'
import { getCart, addToCart, removeCartItem, clearCart } from '../services/cart'

export const useCartStore = create((set, get) => ({
    items: [],
    itemsCount: 0,
    totalPrice: 0,
    loading: false,
    error: null,

    fetchCart: async (email) => {
        set({ loading: true, error: null })
        try {
            const data = await getCart(email)
            set({
                items: data.items ?? [],
                itemsCount: data.itemsCount ?? 0,
                totalPrice: data.totalPrice ?? 0,
            })
        } catch (err) {
            set({ error: err })
        } finally {
            set({ loading: false })
        }
    },

    addItem: async ({ email, extensionId, language, platform }) => {
        set({ loading: true, error: null })
        try {
            await addToCart({ email, extensionId, language, platform })
            await get().fetchCart(email)
        } catch (err) {
            set({ error: err })
            throw err
        } finally {
            set({ loading: false })
        }
    },

    removeItem: async (cartItemId, email) => {
        set({ loading: true, error: null })
        try {
            await removeCartItem(cartItemId, email)
            await get().fetchCart(email)
        } catch (err) {
            set({ error: err })
            throw err
        } finally {
            set({ loading: false })
        }
    },

    clear: async (email) => {
        set({ loading: true, error: null })
        try {
            await clearCart(email)
            set({ items: [], itemsCount: 0, totalPrice: 0 })
        } catch (err) {
            set({ error: err })
            throw err
        } finally {
            set({ loading: false })
        }
    },

    reset: () => set({ items: [], itemsCount: 0, totalPrice: 0, loading: false, error: null }),
}))

export default useCartStore