import { get, post } from './httpClient'

const BASE_URL = '/api/auth'

export function getRegisteredEmails() {
  return get(`${BASE_URL}/emails`)
}

export function register(data) {
  return post(BASE_URL + '/register', data)
}

export function login(email, password) {
  return post(BASE_URL + '/login', { email, password })
}

export function logout() {
  return post(BASE_URL + '/logout')
}

export function forgotPassword(email) {
  return post(BASE_URL + '/forgot-password', { email })
}

export function resetPassword(token, newPassword) {
  return post(BASE_URL + '/reset-password', { token, newPassword })
}