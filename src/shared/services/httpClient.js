import { encrypt, decrypt } from '../utils/crypto'

const requestInterceptors = []
const responseInterceptors = []

const IS_DEV = import.meta.env.DEV

function logRequest(url, options, headers, body) {
  if (!IS_DEV) return
  const isEncrypted = !!headers['X-Encrypted-Payload']
  console.group(`🚀 ${options.method || 'GET'} ${url}`)
  console.log('Headers:', headers)
  if (isEncrypted) {
    console.log('Body: [ENCRYPTED -', headers['X-Encrypted-Payload'].length, 'chars]')
  } else if (body) {
    console.log('Body:', body)
  }
  console.groupEnd()
}

function logResponse(url, res, data) {
  if (!IS_DEV) return
  const emoji = res.ok ? '✅' : '❌'
  console.group(`${emoji} ${res.status} ${url}`)
  console.log('Status:', res.status, res.statusText)
  console.log('Headers:', Object.fromEntries(res.headers.entries()))
  if (data !== undefined) console.log('Data:', data)
  console.groupEnd()
}

export function onRequestInterceptor(fn) {
  requestInterceptors.push(fn)
}

export function onResponseInterceptor(fn) {
  responseInterceptors.push(fn)
}

function getAuthToken() {
  return localStorage.getItem('token')
}

function isPublicEndpoint(url) {
  const publicPatterns = [
    /^\/api\/extensions/,
    /^\/api\/content/,
    /^\/api\/config/,
  ]
  return publicPatterns.some((pattern) => pattern.test(url))
}

async function executeRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const isPublic = isPublicEndpoint(url)
  const token = getAuthToken()

  if (!isPublic) {
    headers['X-Encrypted'] = 'true'
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const body = options.body

  if (!isPublic && body && typeof body === 'object') {
    const encrypted = await encrypt(body)
    headers['X-Encrypted-Payload'] = encrypted
  }

  for (const interceptor of requestInterceptors) {
    const result = await interceptor({ url, headers, method: options.method })
    if (result?.headers) Object.assign(headers, result.headers)
  }

  logRequest(url, options, headers, body)

  const res = await fetch(url, {
    ...options,
    headers,
  })

  for (const interceptor of responseInterceptors) {
    await interceptor(res)
  }

  if (res.status === 204) {
    logResponse(url, res, null)
    return null
  }

  const encryptedResponse = res.headers.get('X-Encrypted-Payload')
  let data
  if (encryptedResponse) {
    data = await decrypt(encryptedResponse)
  } else {
    const text = await res.text()
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  logResponse(url, res, data)

  if (!res.ok) {
    const message = data?.message || data || `Error ${res.status}`
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }

  return data
}

export function get(url, options = {}) {
  return executeRequest(url, { ...options, method: 'GET' })
}

export function post(url, body, options = {}) {
  return executeRequest(url, { ...options, method: 'POST', body })
}

export function put(url, body, options = {}) {
  return executeRequest(url, { ...options, method: 'PUT', body })
}

export function del(url, options = {}) {
  return executeRequest(url, { ...options, method: 'DELETE' })
}

export default { get, post, put, del, onRequestInterceptor, onResponseInterceptor }
