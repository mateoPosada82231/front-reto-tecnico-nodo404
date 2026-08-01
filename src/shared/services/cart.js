// src/shared/services/cart.js
import { get, post, del } from './httpClient'

const BASE_URL = '/api/cart'

export function getCart(email) {
    return get(`${BASE_URL}/${email}`)
}

export function addToCart({ email, extensionId, language, platform }) {
    return post(BASE_URL, { email, extensionId, language, platform })
}

export function removeCartItem(cartItemId, email) {
    return del(`${BASE_URL}/item/${cartItemId}?email=${encodeURIComponent(email)}`)
}

export function clearCart(email) {
    return del(`${BASE_URL}/clear/${email}`)
}