import { post } from './httpClient'

const BASE_URL = '/api/auth'

export function register(data) {
  return post(BASE_URL + '/register', data)
}

export function login(email, password) {
  return post(BASE_URL + '/login', { email, password })
}

export function logout() {
  return post(BASE_URL + '/logout')
}
