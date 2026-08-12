const ERROR_KEYS = {
  user_not_found: [
    'Usuario no encontrado',
    'User not found',
    'No existe un usuario',
    'The user does not exist',
  ],
  duplicate_email: [
    'El correo ya está registrado',
    'El email ya está registrado',
    'Email already registered',
    'Usuario ya existe',
    'User already exists',
    'Correo duplicado',
    'Duplicate email',
  ],
  invalid_credentials: [
    'Credenciales inválidas',
    'Invalid credentials',
    'Contraseña incorrecta',
    'Wrong password',
    'Usuario no encontrado',
    'User not found',
  ],
  session_expired: [
    'Token inválido',
    'Invalid token',
    'Token expirado',
    'Expired token',
  ],
  unauthorized: [
    'No autorizado',
    'Unauthorized',
    'Acceso denegado',
    'Forbidden',
  ],
  required_field: [
    'Campo requerido',
    'Required field',
  ],
  validation_failed: [
    'Validación fallida',
    'Validation failed',
  ],
  server_error: [
    'Error interno',
    'Internal error',
    'Internal server error',
  ],
  service_unavailable: [
    'Servicio no disponible',
    'Service unavailable',
  ],
  already_purchased: [
    'Ya has comprado',
    'already purchased',
    'ya compraste',
  ],
  extension_beta_only: [
    'exclusiva para beta testers',
    'exclusive to beta testers',
    'beta tester',
  ],
}

export function getFriendlyError(messages, err) {
  const message = err?.message || String(err)
  const msg = messages || {}

  for (const [key, keywords] of Object.entries(ERROR_KEYS)) {
    if (keywords.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))) {
      return msg[key] || message
    }
  }

  if (message.includes('400')) return msg.bad_request || message
  if (message.includes('401')) return msg.session_expired || message
  if (message.includes('403')) return msg.unauthorized || message
  if (message.includes('404')) return msg.not_found || message
  if (message.includes('422')) return msg.validation_failed || message
  if (message.includes('500')) return msg.server_error || message
  if (message.includes('503')) return msg.service_unavailable || message
  if (message.includes('Failed to fetch')) return msg.network_error || message
  if (message.includes('NetworkError')) return msg.network_error || message

  if (message.length > 100) return msg.unexpected_error || message
  return message
}
