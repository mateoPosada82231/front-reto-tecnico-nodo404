import { get, post } from './httpClient'

const BASE_URL = '/api/buys'

export function buyDirect(payload) {
  return post(`${BASE_URL}/direct`, payload)
}

export function getUserBuys(email) {
  return get(`${BASE_URL}/user/${email}`)
}

export function checkoutCart(payload) {
  return post(`${BASE_URL}/checkout`, payload)
}