import { get } from './httpClient'
import lang from '../lang'

const BASE_URL = '/api/extensions'

export function getExtensions(language = lang.get()) {
  return get(`${BASE_URL}?language=${language}`)
}

export function getExtensionById(id, language = lang.get()) {
  return get(`${BASE_URL}/${id}?language=${language}`)
}

export function getExtensionsByCategory(category, language = lang.get()) {
  return get(`${BASE_URL}/category/${category}?language=${language}`)
}

export function getExtensionsByDistributor(distributor, language = lang.get()) {
  return get(`${BASE_URL}/distributor/${distributor}?language=${language}`)
}

export function getExtensionsByAge(age, language = lang.get()) {
  return get(`${BASE_URL}/age/${age}?language=${language}`)
}

export function getTrending(language = lang.get()) {
  return get(`${BASE_URL}/trending?language=${language}`)
}

export function getRandom(language = lang.get()) {
  return get(`${BASE_URL}/random?language=${language}`)
}
