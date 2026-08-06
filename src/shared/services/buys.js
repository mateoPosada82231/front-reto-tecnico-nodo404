import { get, post } from './httpClient'
import lang from '../lang'

const BASE_URL = '/api/buys'

export function buyDirect(payload) {
  return post(`${BASE_URL}/direct`, payload)
}

export function getUserBuys(email, language = lang.get()) {
  return get(`${BASE_URL}/user/${email}?language=${language}`)
}

export function checkoutCart(payload) {
  return post(`${BASE_URL}/checkout`, payload)
}