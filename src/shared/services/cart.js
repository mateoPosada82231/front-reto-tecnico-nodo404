// src/shared/services/cart.js
import { get, post, del } from './httpClient'
import lang from '../lang'

const BASE_URL = '/api/cart'

export function getCart(email, language = lang.get()) {
    return get(`${BASE_URL}/${email}?language=${language}`)
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