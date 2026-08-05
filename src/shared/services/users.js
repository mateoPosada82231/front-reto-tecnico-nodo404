import { get, put, post } from './httpClient'

const BASE_URL = '/api/users'

export function getUsers() {
  return get(BASE_URL)
}

export function getUserByEmail(email) {
  return get(`${BASE_URL}/${email}`)
}

export function updateUser(email, data) {
  return put(`${BASE_URL}/${email}`, data)
}
export function changePassword(data) {
  return post(`${BASE_URL}/change-password`, data)
}