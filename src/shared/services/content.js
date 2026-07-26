const BASE_URL = '/api/content'
const CONFIG_URL = '/api/config'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}

export function getContentBySection(sectionKey) {
  return fetchJSON(`${BASE_URL}/${sectionKey}`)
}

export function getContentByKey(sectionKey, contentKey) {
  return fetchJSON(`${BASE_URL}/${sectionKey}/${contentKey}`)
}

export function getConfig(configKey) {
  return fetchJSON(`${CONFIG_URL}/${configKey}`)
}

export function createContent(data) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json())
}

export function updateContent(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json())
}

export function deleteContent(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((r) => r.json())
}

export function createConfig(data) {
  return fetch(CONFIG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json())
}

export function updateConfig(id, data) {
  return fetch(`${CONFIG_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json())
}

export function deleteConfig(id) {
  return fetch(`${CONFIG_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((r) => r.json())
}
