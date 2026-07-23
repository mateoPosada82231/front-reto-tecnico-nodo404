const BASE_URL = '/api/auth'

async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }

  if (!res.ok) throw new Error(data.message || data || `Error ${res.status}`)
  return data
}

export function register(data) {
  return request(BASE_URL + '/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(email, password) {
  return request(BASE_URL + '/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function logout() {
  return request(BASE_URL + '/logout', { method: 'POST' })
}
