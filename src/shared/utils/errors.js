const ERROR_MAP = {
  'El correo ya está registrado': 'Este correo ya está registrado',
  'Email already registered': 'Este correo ya está registrado',
  'Usuario ya existe': 'Este correo ya está registrado',
  'User already exists': 'Este correo ya está registrado',
  'Correo duplicado': 'Este correo ya está registrado',
  'Duplicate email': 'Este correo ya está registrado',
  'Credenciales inválidas': 'Correo o contraseña incorrectos',
  'Invalid credentials': 'Correo o contraseña incorrectos',
  'Contraseña incorrecta': 'Correo o contraseña incorrectos',
  'Wrong password': 'Correo o contraseña incorrectos',
  'Usuario no encontrado': 'Correo o contraseña incorrectos',
  'User not found': 'Correo o contraseña incorrectos',
  'Token inválido': 'Sesión expirada, inicia sesión de nuevo',
  'Invalid token': 'Sesión expirada, inicia sesión de nuevo',
  'Token expirado': 'Sesión expirada, inicia sesión de nuevo',
  'Expired token': 'Sesión expirada, inicia sesión de nuevo',
  'No autorizado': 'No tienes permisos para esta acción',
  'Unauthorized': 'No tienes permisos para esta acción',
  'Acceso denegado': 'No tienes permisos para esta acción',
  'Forbidden': 'No tienes permisos para esta acción',
  'Campo requerido': 'Completa todos los campos obligatorios',
  'Required field': 'Completa todos los campos obligatorios',
  'Validación fallida': 'Revisa los datos ingresados',
  'Validation failed': 'Revisa los datos ingresados',
  'Error interno': 'Error del servidor, intenta más tarde',
  'Internal error': 'Error del servidor, intenta más tarde',
  'Internal server error': 'Error del servidor, intenta más tarde',
  'Servicio no disponible': 'Servicio no disponible, intenta más tarde',
  'Service unavailable': 'Servicio no disponible, intenta más tarde',
}

export function getFriendlyError(err) {
  const message = err?.message || String(err)

  for (const [key, friendly] of Object.entries(ERROR_MAP)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return friendly
    }
  }

  if (message.includes('400')) return 'Datos inválidos'
  if (message.includes('401')) return 'Sesión expirada, inicia sesión de nuevo'
  if (message.includes('403')) return 'No tienes permisos para esta acción'
  if (message.includes('404')) return 'Recurso no encontrado'
  if (message.includes('422')) return 'Revisa los datos ingresados'
  if (message.includes('500')) return 'Error del servidor, intenta más tarde'
  if (message.includes('503')) return 'Servicio no disponible, intenta más tarde'
  if (message.includes('Failed to fetch')) return 'Sin conexión al servidor'
  if (message.includes('NetworkError')) return 'Sin conexión al servidor'

  return message.length > 100 ? 'Error inesperado, intenta de nuevo' : message
}