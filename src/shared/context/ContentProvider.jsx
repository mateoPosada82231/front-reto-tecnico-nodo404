import { useState, useEffect, useMemo } from 'react'
import { getContentBySection, getConfig } from '../services/content'
import { ContentContext } from './ContentContext'

const SECTIONS = [
  'landing.hero',
  'landing.grid',
  'landing.welcome',
  'auth.login',
  'auth.register',
  'auth.social',
  'auth.oauth',
  'header',
  'beta_modal',
  'footer',
  'common',
  'profile.page',
  'theme.toggle',
  'validation.login',
  'validation.register',
  'validation.profile',
  'errors.common',
  'placeholders',
  'select.default',
]

const CONFIG_KEYS = ['countries']

const FALLBACK = {
  'landing.hero': {
    cta_text: 'Comprar ahora',
    error_prefix: 'Error al cargar extensiones: ',
    prev_aria: 'Paquete anterior',
    next_aria: 'Paquete siguiente',
    slide_aria_prefix: 'Ir al paquete',
  },
  'landing.grid': {
    title: 'Paquetes de Expansión',
    error_prefix: 'Error al cargar extensiones: ',
    cta_text: 'Ver más',
  },
  'landing.welcome': {
    title: '¡Bienvenido a Los Sims 4!',
    subtitle: 'Explora todos los paquetes de expansión y descubre nuevas aventuras para tus Sims.',
    cta_text: 'Explorar',
    close_aria: 'Cerrar',
  },
  'auth.login': {
    title: 'Iniciar Sesión',
    subtitle: 'Accede con tu cuenta para gestionar tus compras.',
    email_label: 'Correo electrónico',
    password_label: 'Contraseña',
    submit_text: 'Iniciar Sesión',
    loading_text: 'Iniciando sesión...',
    success_message: 'Inicio de sesión exitoso. Redirigiendo...',
  },
  'auth.register': {
    title: 'Crear Cuenta',
    subtitle: 'Regístrate para acceder a todas las funcionalidades.',
    fullname_label: 'Nombre completo',
    fullname_placeholder: 'Juan Pérez',
    email_label: 'Correo electrónico',
    country_label: 'País',
    birthdate_label: 'Fecha de nacimiento',
    id_label: 'Número de identificación',
    phone_label: 'Número de celular',
    password_label: 'Contraseña',
    password_placeholder: 'Mayúscula, número y carácter especial',
    confirm_password_label: 'Confirmar contraseña',
    confirm_password_placeholder: 'Repite tu contraseña',
    submit_text: 'Crear Cuenta',
    loading_text: 'Creando cuenta...',
    success_message: 'Cuenta creada con éxito. Ya puedes iniciar sesión.',
  },
  'auth.social': {
    divider_login: 'O inicia sesión con',
    divider_register: 'O regístrate con',
  },
  'auth.oauth': {
    loading_text: 'Iniciando sesión...',
  },
  header: {
    profile_warning: 'Completa tu información en el perfil',
    nav_home: 'Inicio',
    nav_register: 'Registro',
    nav_login: 'Login',
    beta_cta: 'Ser Beta Tester',
    logout_aria: 'Cerrar sesión',
    menu_aria: 'Menú',
    profile_link_aria: 'Ver perfil',
    beta_badge_label: 'Beta',
    mobile_profile_link: 'Perfil',
  },
  beta_modal: {
    close_aria: 'Cerrar',
    already_title: 'Ya eres Beta Tester',
    already_description: 'Ahora tienes acceso anticipado a nuevas extensiones y funciones exclusivas.',
    already_cta: 'Entendido',
    confirm_title: 'Ser Beta Tester',
    confirm_description: '¿Seguro que quieres unirte al programa beta? Tendrás acceso anticipado a nuevas extensiones antes que nadie.',
    cancel_text: 'Cancelar',
    processing_text: 'Procesando',
    confirm_cta: 'Sí, quiero ser beta',
  },
  footer: {
    copyright: 'Todos los derechos reservados.',
  },
  common: {
    loading_aria: 'Cargando',
  },
  'profile.page': {
    name_fallback: 'Sin nombre',
    beta_badge: 'Beta tester',
    fullname_label: 'Nombre completo',
    country_label: 'País',
    identification_label: 'Número de identificación',
    phone_label: 'Número de celular',
    birthdate_label: 'Fecha de nacimiento',
    edit_button: 'Editar perfil',
    cancel_button: 'Cancelar',
    save_button: 'Guardar cambios',
    success_message: 'Perfil actualizado con éxito',
    error_message: 'No se pudo actualizar el perfil',
  },
  'theme.toggle': {
    light_aria: 'Cambiar a tema claro',
    dark_aria: 'Cambiar a tema oscuro',
  },
  'validation.login': {
    email_required: 'El correo es obligatorio',
    email_invalid: 'Correo inválido',
    password_required: 'Ingrese una contraseña',
  },
  'validation.register': {
    name_required: 'El nombre es obligatorio',
    email_required: 'El correo es obligatorio',
    email_invalid: 'Correo inválido',
    country_required: 'Seleccione un país',
    birthdate_required: 'Seleccione una fecha',
    id_required: 'Ingrese su identificación',
    phone_required: 'Ingrese su celular',
    password_required: 'Ingrese una contraseña',
    password_min_length: 'La contraseña debe tener mínimo 8 caracteres',
    password_uppercase: 'Debe contener al menos una mayúscula',
    password_number: 'Debe contener al menos un número',
    password_special: 'Debe contener al menos un carácter especial',
    confirm_required: 'Confirme su contraseña',
    confirm_match: 'Las contraseñas no coinciden',
  },
  'validation.profile': {
    name_required: 'El nombre es obligatorio',
  },
  'errors.common': {
    duplicate_email: 'Este correo ya está registrado',
    invalid_credentials: 'Correo o contraseña incorrectos',
    session_expired: 'Sesión expirada, inicia sesión de nuevo',
    unauthorized: 'No tienes permisos para esta acción',
    required_field: 'Completa todos los campos obligatorios',
    validation_failed: 'Revisa los datos ingresados',
    server_error: 'Error del servidor, intenta más tarde',
    service_unavailable: 'Servicio no disponible, intenta más tarde',
    bad_request: 'Datos inválidos',
    not_found: 'Recurso no encontrado',
    network_error: 'Sin conexión al servidor',
    unexpected_error: 'Error inesperado, intenta de nuevo',
  },
  placeholders: {
    email: 'tu@email.com',
    password: '••••••••',
    id: '123456789',
    phone: '+57 300 123 4567',
  },
  'select.default': {
    placeholder: 'Seleccione...',
  },
}

const FALLBACK_CONFIG = {
  countries: [
    { value: 'CO', label: 'Colombia' },
    { value: 'MX', label: 'México' },
    { value: 'AR', label: 'Argentina' },
    { value: 'CL', label: 'Chile' },
    { value: 'PE', label: 'Perú' },
    { value: 'ES', label: 'España' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'BR', label: 'Brasil' },
  ],
}

function mapItemsToObj(items) {
  const obj = {}
  items.forEach((item) => {
    obj[item.key] = item.value
  })
  return obj
}

export function ContentProvider({ children }) {
  const [sections, setSections] = useState(FALLBACK)
  const [configs, setConfigs] = useState(FALLBACK_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      try {
        const sectionResults = await Promise.allSettled(
          SECTIONS.map((key) => getContentBySection(key))
        )

        if (cancelled) return

        const mergedSections = { ...FALLBACK }
        sectionResults.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value?.items) {
            const mapped = mapItemsToObj(result.value.items)
            mergedSections[SECTIONS[i]] = {
              ...FALLBACK[SECTIONS[i]],
              ...mapped,
            }
          }
        })
        setSections(mergedSections)

        const configResults = await Promise.allSettled(
          CONFIG_KEYS.map((key) => getConfig(key))
        )

        if (cancelled) return

        const mergedConfigs = { ...FALLBACK_CONFIG }
        configResults.forEach((result, i) => {
          const raw = result.status === 'fulfilled' ? result.value?.value : null
          if (Array.isArray(raw)) {
            mergedConfigs[CONFIG_KEYS[i]] = raw
          }
        })
        setConfigs(mergedConfigs)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  const value = useMemo(() => ({
    sections,
    configs,
    loading,
    error,
  }), [sections, configs, loading, error])

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}
