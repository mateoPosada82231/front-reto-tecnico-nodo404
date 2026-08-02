import { get } from './httpClient'

const BASE_URL = '/api/extensions'

export function getExtensions(language = 'es') {
  return get(`${BASE_URL}?language=${language}`)
}

export function getExtensionById(id, language = 'es') {
  return get(`${BASE_URL}/${id}?language=${language}`)
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
