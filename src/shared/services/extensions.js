import { get } from './httpClient'

const BASE_URL = '/api/extensions'

export function getExtensions() {
  return get(BASE_URL)
}

export function getExtensionById(id) {
  return get(`${BASE_URL}/${id}`)
}

export function getExtensionsByCategory(category) {
  return get(`${BASE_URL}/category/${category}`)
}

export function getExtensionsByDistributor(distributor) {
  return get(`${BASE_URL}/distributor/${distributor}`)
}

export function getExtensionsByAge(age) {
  return get(`${BASE_URL}/age/${age}`)
}

export function getTrending() {
  return get(`${BASE_URL}/trending`)
}

export function getRandom() {
  return get(`${BASE_URL}/random`)
}
