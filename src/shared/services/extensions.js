const BASE_URL = '/api/extensions'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}

export function getExtensions() {
  return fetchJSON(BASE_URL)
}

export function getExtensionById(id) {
  return fetchJSON(`${BASE_URL}/${id}`)
}

export function getExtensionsByCategory(category) {
  return fetchJSON(`${BASE_URL}/category/${category}`)
}

export function getExtensionsByDistributor(distributor) {
  return fetchJSON(`${BASE_URL}/distributor/${distributor}`)
}

export function getExtensionsByAge(age) {
  return fetchJSON(`${BASE_URL}/age/${age}`)
}

export function getTrending() {
  return fetchJSON(`${BASE_URL}/trending`)
}

export function getRandom() {
  return fetchJSON(`${BASE_URL}/random`)
}
