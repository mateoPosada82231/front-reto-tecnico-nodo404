const ALGORITHM = 'AES-GCM'
const IV_LENGTH = 12

const ENCRYPTION_KEY_B64 = import.meta.env.VITE_ENCRYPTION_KEY || 'R4VhZzxNzz9gTs3CJ23LH0ZpCvCm74EScFsvgvtMOss='

const keyData = Uint8Array.from(atob(ENCRYPTION_KEY_B64), c => c.charCodeAt(0))
if (keyData.length !== 32) {
  throw new Error('VITE_ENCRYPTION_KEY debe ser 32 bytes (Base64 de 256 bits)')
}

let cryptoKey = null

async function getKey() {
  if (cryptoKey) return cryptoKey
  cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt'],
  )
  return cryptoKey
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function encrypt(data) {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(JSON.stringify(data))

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    plaintext,
  )

  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return arrayBufferToBase64(combined)
}

export async function decrypt(base64Data) {
  const key = await getKey()
  const combined = base64ToArrayBuffer(base64Data)

  const iv = combined.slice(0, IV_LENGTH)
  const ciphertext = combined.slice(IV_LENGTH)

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext,
  )

  const decoder = new TextDecoder()
  const decoded = decoder.decode(decrypted)
  try {
    return JSON.parse(decoded)
  } catch {
    return decoded
  }
}

export function isEncryptedPayload(value) {
  if (typeof value !== 'string') return false
  try {
    const bytes = base64ToArrayBuffer(value)
    return bytes.length > IV_LENGTH
  } catch {
    return false
  }
}