const BASE_URL = '/api/beta-testers'

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

export function registerBetaTester(data) {
  return request('/api/auth/beta/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getBetaTesters() {
  return request(BASE_URL)
}

export function getBetaTesterByEmail(email) {
  return request(`${BASE_URL}/${email}`)
}
