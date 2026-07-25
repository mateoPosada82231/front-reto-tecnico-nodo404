const BASE_URL = '/api/users'

async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = text }
    throw new Error(data.message || data || `Error ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export function getUsers() {
  return request(BASE_URL)
}

export function getUserByEmail(email) {
  return request(`${BASE_URL}/${email}`)
}

export function updateUser(email, data) {
  return request(`${BASE_URL}/${email}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
