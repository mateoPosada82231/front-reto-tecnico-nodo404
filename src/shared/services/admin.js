import { get, post } from './httpClient'

const BASE_URL = '/api/admin'

export function getBetaUsers() {
  return get(`${BASE_URL}/users/beta`)
}

export function getExtensionStats() {
  return get(`${BASE_URL}/extensions/stats`)
}

export function broadcastBetaTesters(subject, body) {
  return post(`${BASE_URL}/broadcast`, { subject, body })
}

export function promoteToAdmin(email) {
  return post(`${BASE_URL}/users/promote`, { email })
}