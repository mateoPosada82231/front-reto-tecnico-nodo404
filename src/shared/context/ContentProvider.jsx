import { useState, useEffect, useMemo } from 'react'
import { getContentBySection, getConfig } from '../services/content'
import { ContentContext } from './ContentContext'
import lang from '../lang'

const SECTIONS = [
  'landing.hero',
  'landing.grid',
  'landing.welcome',
  'landing.detail',
  'auth.login',
  'auth.register',
  'auth.social',
  'auth.oauth',
  'auth.forgot_password',
  'header',
  'beta_modal',
  'footer',
  'common',
  'profile.page',
  'profile.password',
  'admin.page',
  'theme.toggle',
  'validation.login',
  'validation.register',
  'validation.profile',
  'validation.password',
  'errors.common',
  'placeholders',
  'select.default',
  'extensions.search',
  'cart',
  'about.page',
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
    beta_badge_label: 'Beta',
    filter_purchased: 'Compradas',
    filter_not_purchased: 'No compradas',
    filter_empty: 'No hay extensiones para mostrar con este filtro.',
  },
  'landing.welcome': {
    title: '¡Bienvenido a Los Sims 4!',
    subtitle: 'Explora todos los paquetes de expansión y descubre nuevas aventuras para tus Sims.',
    cta_text: 'Explorar',
    close_aria: 'Cerrar',
  },
  'landing.detail': {
    loading_text: 'Cargando expansión...',
    not_found: 'Expansión no encontrada.',
    back_text: 'Volver',
    category_label: 'Categoría',
    price_label: 'Precio',
    about_label: 'Acerca del juego',
    platforms_label: 'Plataformas',
    languages_label: 'Idiomas',
    distributor_label: 'Distribuidor',
    publication_date_label: 'Fecha de publicación',
    required_age_label: 'Edad requerida',
    years_text: 'años',
    buy_button: 'Comprar',
    login_required: 'Debes iniciar sesión para comprar.',
    login_link: 'Ir a login',
    success_message: '¡Compra realizada con éxito!',
    payment_method_label: 'Método de pago',
    language_label: 'Idioma',
    platform_label: 'Plataforma',
    confirm_button: 'Confirmar compra',
    cancel_button: 'Cancelar',
    processing_text: 'Comprando...',
    payment_method_card: 'Tarjeta',
    payment_method_paypal: 'PayPal',
    language_es: 'Español',
    language_en: 'Inglés',
    beta_badge_label: 'Beta',
    beta_only_notice: 'Esta extensión es exclusiva para beta testers. Conviértete en beta para adquirirla.',
    beta_only_cta: 'Quiero ser beta tester',
    in_library_badge: 'En biblioteca',
  },
  'auth.login': {
    title: 'Iniciar Sesión',
    subtitle: 'Accede con tu cuenta para gestionar tus compras.',
    email_label: 'Correo electrónico',
    password_label: 'Contraseña',
    submit_text: 'Iniciar Sesión',
    loading_text: 'Iniciando sesión...',
    success_message: 'Inicio de sesión exitoso. Redirigiendo...',
    forgot_password_link: '¿Olvidaste tu contraseña?',
    no_account_text: '¿No tienes cuenta?',
    no_account_link: 'Regístrate',
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
    has_account_text: '¿Ya tienes cuenta?',
    has_account_link: 'Inicia sesión',
  },
  'auth.social': {
    divider_login: 'O inicia sesión con',
    divider_register: 'O regístrate con',
  },
  'auth.oauth': {
    loading_text: 'Iniciando sesión...',
  },
  header: {
    profile_warning_prefix: 'Completa tu información',
    profile_warning_link: 'aquí',
    nav_home: 'Inicio',
    nav_register: 'Registro',
    nav_login: 'Login',
    beta_cta: 'Ser Beta Tester',
    logout_aria: 'Cerrar sesión',
    menu_aria: 'Menú',
    profile_link_aria: 'Ver perfil',
    beta_badge_label: 'Beta',
    mobile_profile_link: 'Perfil',
    nav_admin: 'Admin',
    switch_language_aria_en: 'Switch to English',
    switch_language_aria_es: 'Cambiar a español',
  },
  'admin.page': {
    title: 'Panel de Administrador',
    beta_users_tab: 'Usuarios Beta',
    stats_tab: 'Estadísticas',
    broadcast_tab: 'Correo Broadcast',
    promote_tab: 'Promover Admin',
    table_email: 'Email',
    table_name: 'Nombre',
    table_country: 'País',
    table_extension: 'Extensión',
    table_count: 'Compras',
    table_public: 'Público',
    table_private: 'Beta',
    broadcast_subject_label: 'Asunto',
    broadcast_body_label: 'Cuerpo',
    broadcast_send: 'Enviar',
    broadcast_success: 'Correo enviado exitosamente',
    broadcast_error: 'Error al enviar correo',
    broadcast_confirm: '¿Estás seguro de enviar el broadcast a todos los beta testers?',
    promote_search_placeholder: 'Buscar usuario por email',
    promote_button: 'Hacer admin',
    promote_success: 'Usuario promovido a administrador',
    promote_error: 'Error al promover usuario',
    no_perms: 'No tienes permisos de administrador',
    loading_text: 'Cargando...',
    loading_error: 'Error al cargar datos',
    admin_badge: 'Administrador',
    cancel_text: 'Cancelar',
    empty_beta: 'No hay usuarios beta registrados',
    empty_stats: 'Aún no hay compras registradas',
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
    about_link: 'Sobre este proyecto',
  },
  'about.page': {
    title: 'Sobre este proyecto',
    description: 'Esta página es el resultado del reto técnico impuesto por Electronic Arts Inc en conjunto con Nodo Eafit, para desarrollar en el transcurso del bootcamp de desarrollo web.',
  },
  common: {
    loading_aria: 'Cargando',
    close_aria: 'Cerrar',
    loading_router: 'Cargando…',
    show_password_aria: 'Mostrar contraseña',
    hide_password_aria: 'Ocultar contraseña',
  },
  'auth.forgot_password': {
    title: '¿Olvidaste tu contraseña?',
    subtitle: 'Escribe tu correo y te enviaremos un link para restablecerla.',
    email_label: 'Correo electrónico',
    success_message: 'Si el correo existe, revisa tu bandeja de entrada para continuar.',
    loading_text: 'Enviando...',
    submit_text: 'Enviar link de recuperación',
    back_to_login: '← Volver a iniciar sesión',
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
    security_title: 'Seguridad',
    security_subtitle: 'Actualiza tu contraseña periódicamente para mantener tu cuenta protegida.',
    change_password_button: 'Cambiar contraseña',
    purchases_title: 'Mis compras',
    purchases_loading: 'Cargando compras...',
    purchases_empty: 'Aún no has comprado ninguna expansión.',
    purchases_item_meta: 'Comprado el {{date}} · {{paymentMethod}}',
    beta_extensions_title: 'Mis extensiones beta',
    beta_extensions_loading: 'Cargando extensiones beta...',
    beta_extensions_empty: 'Aún no tienes extensiones beta.',
    beta_extensions_item_meta: 'Comprado el {{date}}',
  },
  'profile.password': {
    title: 'Cambiar contraseña',
    current_label: 'Contraseña actual',
    new_label: 'Nueva contraseña',
    new_placeholder: 'Mayúscula, número y carácter especial',
    confirm_label: 'Confirmar nueva contraseña',
    submit_text: 'Cambiar contraseña',
    cancel_text: 'Cancelar',
    success_text: 'Contraseña cambiada correctamente.',
    success_cta: 'Entendido',
    error_text: 'Error al cambiar la contraseña.',
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
    email_already_registered: 'Este correo ya está registrado',
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
  'validation.password': {
    current_required: 'Ingrese su contraseña actual',
    password_required: 'Ingrese una contraseña',
    password_min_length: 'La contraseña debe tener mínimo 8 caracteres',
    password_uppercase: 'Debe contener al menos una mayúscula',
    password_number: 'Debe contener al menos un número',
    password_special: 'Debe contener al menos un carácter especial',
    confirm_required: 'Confirme su contraseña',
    confirm_match: 'Las contraseñas no coinciden',
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
    already_purchased: 'Ya has comprado esta extensión',
    extension_beta_only: 'Esta extensión es exclusiva para beta testers',
    user_not_found: 'El usuario no existe',
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
  'extensions.search': {
    placeholder: 'Buscar extensiones...',
    search_aria: 'Buscar extensiones',
    clear_aria: 'Limpiar búsqueda',
    empty_results: 'No se encontraron resultados para "{{query}}".',
  },
  cart: {
    title: 'Tu carrito',
    close_aria: 'Cerrar carrito',
    aria_label: 'Carrito de compras',
    empty_title: 'Tu carrito está vacío',
    empty_subtitle: 'Agrega paquetes de expansión para verlos aquí.',
    explore_cta: 'Explorar paquetes',
    remove_aria: 'Quitar producto',
    clear_cta: 'Vaciar carrito',
    total_label: 'Total',
    order_summary: 'Resumen del pedido',
    packages_count: '{{count}} paquete',
    packages_count_plural: '{{count}} paquetes',
    checkout_cta: 'Proceder al pago',
    checkout_processing: 'Procesando compra...',
    checkout_success: '¡Compra realizada con éxito!',
    checkout_success_title: '¡Gracias por tu compra!',
    checkout_success_subtitle: 'Tus paquetes de expansión ya están disponibles.',
    checkout_success_items: '{{count}} paquete(s) comprado(s)',
    checkout_success_total: 'Total pagado',
    checkout_success_close: 'Cerrar',
    checkout_success_explore: 'Seguir explorando',
    checkout_error_title: 'Error en la compra',
    checkout_error_subtitle: 'No se pudo completar el pedido.',
    checkout_error_retry: 'Reintentar',
    checkout_error_continue: 'Seguir comprando',
    checkout_error_close: 'Cerrar',
    login_required: 'Inicia sesión para ver tu carrito',
    login_link: 'Ir a login',
    platform_label: 'Plataforma',
    language_label: 'Idioma',
  },
}

const FALLBACK_EN = {
  'landing.hero': {
    title: 'Welcome to Nodo Store',
    subtitle: 'Discover the best games and expansion packs',
    cta_text: 'Buy now',
    error_prefix: 'Error loading extensions: ',
    prev_aria: 'Previous pack',
    next_aria: 'Next pack',
    slide_aria_prefix: 'Go to pack',
  },
  'landing.grid': {
    title: 'Expansion Packs',
    error_prefix: 'Error loading extensions: ',
    cta_text: 'View more',
    beta_badge_label: 'Beta',
    filter_purchased: 'Purchased',
    filter_not_purchased: 'Not purchased',
    filter_empty: 'No extensions to show with this filter.',
  },
  'landing.welcome': {
    title: 'Welcome to The Sims 4!',
    subtitle: 'Explore all expansion packs and discover new adventures for your Sims.',
    cta_text: 'Explore',
    close_aria: 'Close',
  },
  'landing.detail': {
    loading_text: 'Loading expansion...',
    not_found: 'Expansion not found.',
    back_text: 'Back',
    category_label: 'Category',
    price_label: 'Price',
    about_label: 'About the game',
    platforms_label: 'Platforms',
    languages_label: 'Languages',
    distributor_label: 'Distributor',
    publication_date_label: 'Release date',
    required_age_label: 'Required age',
    years_text: 'years',
    buy_button: 'Buy Now',
    add_to_cart_button: 'Add to Cart',
    add_to_cart_success: 'Expansion added to cart successfully!',
    login_required: 'You must log in to buy.',
    login_link: 'Go to login',
    success_message: 'Purchase completed successfully!',
    payment_method_label: 'Payment method',
    language_label: 'Language',
    platform_label: 'Platform',
    confirm_button: 'Confirm purchase',
    cancel_button: 'Cancel',
    processing_text: 'Purchasing...',
    payment_method_card: 'Card',
    payment_method_paypal: 'PayPal',
    language_es: 'Spanish',
    language_en: 'English',
    beta_badge_label: 'Beta',
    beta_only_notice: 'This extension is exclusive to beta testers. Become one to purchase it.',
    beta_only_cta: 'Become a beta tester',
    in_library_badge: 'In library',
  },
  'auth.login': {
    title: 'Log In',
    subtitle: 'Access your account to manage your purchases.',
    email_label: 'Email address',
    password_label: 'Password',
    submit_text: 'Log In',
    loading_text: 'Logging in...',
    success_message: 'Log in successful. Redirecting...',
    forgot_password_link: 'Forgot your password?',
    no_account_text: 'No account yet?',
    no_account_link: 'Sign up',
  },
  'auth.register': {
    title: 'Create Account',
    subtitle: 'Sign up to access all store features.',
    fullname_label: 'Full name',
    fullname_placeholder: 'John Doe',
    email_label: 'Email address',
    country_label: 'Country',
    birthdate_label: 'Birth date',
    id_label: 'ID number',
    phone_label: 'Phone number',
    password_label: 'Password',
    password_placeholder: 'Uppercase, number and special character',
    confirm_password_label: 'Confirm password',
    confirm_password_placeholder: 'Repeat your password',
    submit_text: 'Create Account',
    loading_text: 'Creating account...',
    success_message: 'Account created successfully. You can now log in.',
    has_account_text: 'Already have an account?',
    has_account_link: 'Log in',
  },
  'auth.social': {
    divider_login: 'Or log in with',
    divider_register: 'Or sign up with',
  },
  'auth.oauth': {
    loading_text: 'Logging in...',
  },
  'auth.forgot_password': {
    title: 'Forgot your password?',
    subtitle: 'Enter your email and we will send you a link to reset it.',
    email_label: 'Email address',
    success_message: 'If the email exists, check your inbox to continue.',
    loading_text: 'Sending...',
    submit_text: 'Send recovery link',
    back_to_login: '← Back to login',
  },
  header: {
    profile_warning_prefix: 'Complete your profile information',
    profile_warning_link: 'here',
    nav_home: 'Home',
    nav_register: 'Register',
    nav_login: 'Login',
    beta_cta: 'Become Beta Tester',
    logout_aria: 'Log out',
    menu_aria: 'Menu',
    profile_link_aria: 'View profile',
    beta_badge_label: 'Beta',
    mobile_profile_link: 'Profile',
    nav_admin: 'Admin',
    switch_language_aria_en: 'Switch to English',
    switch_language_aria_es: 'Switch to Spanish',
  },
  'admin.page': {
    title: 'Admin Panel',
    beta_users_tab: 'Beta Users',
    stats_tab: 'Stats',
    broadcast_tab: 'Broadcast Email',
    promote_tab: 'Promote Admin',
    table_email: 'Email',
    table_name: 'Name',
    table_country: 'Country',
    table_extension: 'Extension',
    table_count: 'Purchases',
    table_public: 'Public',
    table_private: 'Beta',
    broadcast_subject_label: 'Subject',
    broadcast_body_label: 'Body',
    broadcast_send: 'Send',
    broadcast_success: 'Email sent successfully',
    broadcast_error: 'Error sending email',
    broadcast_confirm: 'Are you sure you want to send the broadcast to all beta testers?',
    promote_search_placeholder: 'Search user by email',
    promote_button: 'Make admin',
    promote_success: 'User promoted to admin',
    promote_error: 'Error promoting user',
    no_perms: 'You do not have admin permissions',
    loading_text: 'Loading...',
    loading_error: 'Error loading data',
    admin_badge: 'Administrator',
    cancel_text: 'Cancel',
    empty_beta: 'No beta users registered',
    empty_stats: 'No purchases recorded yet',
  },
  beta_modal: {
    close_aria: 'Close',
    already_title: 'You are already a Beta Tester',
    already_description: 'Now you have early access to new extensions and exclusive features.',
    already_cta: 'Understood',
    confirm_title: 'Become Beta Tester',
    confirm_description: 'Are you sure you want to join the beta program? You will get early access to new extensions.',
    cancel_text: 'Cancel',
    processing_text: 'Processing',
    confirm_cta: 'Yes, join beta',
  },
  footer: {
    copyright: '© 2026 Nodo Store. All rights reserved.',
    about_link: 'About this project',
  },
  'about.page': {
    title: 'About this project',
    description: 'This page is the result of the technical challenge imposed by Electronic Arts Inc together with Nodo Eafit, to be developed during the web development bootcamp.',
  },
  common: {
    loading_aria: 'Loading',
    close_aria: 'Close',
    loading_router: 'Loading…',
    show_password_aria: 'Show password',
    hide_password_aria: 'Hide password',
  },
  'profile.page': {
    name_fallback: 'No name',
    beta_badge: 'Beta tester',
    fullname_label: 'Full name',
    country_label: 'Country',
    identification_label: 'ID number',
    phone_label: 'Phone number',
    birthdate_label: 'Birth date',
    edit_button: 'Edit profile',
    cancel_button: 'Cancel',
    save_button: 'Save changes',
    success_message: 'Profile updated successfully',
    error_message: 'Could not update profile',
    security_title: 'Security',
    security_subtitle: 'Update your password regularly to keep your account safe.',
    change_password_button: 'Change password',
    purchases_title: 'My purchases',
    purchases_loading: 'Loading purchases...',
    purchases_empty: 'You have not purchased any expansion packs yet.',
    purchases_item_meta: 'Purchased on {{date}} · {{paymentMethod}}',
    beta_extensions_title: 'My beta extensions',
    beta_extensions_loading: 'Loading beta extensions...',
    beta_extensions_empty: 'You have no beta extensions yet.',
    beta_extensions_item_meta: 'Purchased on {{date}}',
  },
  'profile.password': {
    title: 'Change password',
    current_label: 'Current password',
    new_label: 'New password',
    new_placeholder: 'Uppercase, number and special character',
    confirm_label: 'Confirm new password',
    submit_text: 'Change password',
    cancel_text: 'Cancel',
    success_text: 'Password changed successfully.',
    success_cta: 'Understood',
    error_text: 'Error changing password.',
  },
  'theme.toggle': {
    light_aria: 'Switch to light theme',
    dark_aria: 'Switch to dark theme',
  },
  'validation.login': {
    email_required: 'Email is required',
    email_invalid: 'Invalid email',
    password_required: 'Please enter a password',
  },
  'validation.register': {
    name_required: 'Name is required',
    email_required: 'Email is required',
    email_invalid: 'Invalid email',
    email_already_registered: 'This email is already registered',
    country_required: 'Select a country',
    birthdate_required: 'Select a date',
    id_required: 'Enter your ID',
    phone_required: 'Enter your phone number',
    password_required: 'Please enter a password',
    password_min_length: 'Password must be at least 8 characters',
    password_uppercase: 'Must contain at least one uppercase letter',
    password_number: 'Must contain at least one number',
    password_special: 'Must contain at least one special character',
    confirm_required: 'Confirm your password',
    confirm_match: 'Passwords do not match',
  },
  'validation.profile': {
    name_required: 'Name is required',
  },
  'validation.password': {
    current_required: 'Enter your current password',
    password_required: 'Please enter a password',
    password_min_length: 'Password must be at least 8 characters',
    password_uppercase: 'Must contain at least one uppercase letter',
    password_number: 'Must contain at least one number',
    password_special: 'Must contain at least one special character',
    confirm_required: 'Confirm your password',
    confirm_match: 'Passwords do not match',
  },
  'errors.common': {
    duplicate_email: 'This email is already registered',
    invalid_credentials: 'Invalid email or password',
    session_expired: 'Session expired, please log in again',
    unauthorized: 'You do not have permission for this action',
    required_field: 'Please fill in all required fields',
    validation_failed: 'Please check entered data',
    server_error: 'Server error, please try again later',
    service_unavailable: 'Service unavailable, please try again later',
    bad_request: 'Invalid data',
    not_found: 'Resource not found',
    network_error: 'No server connection',
    unexpected_error: 'Unexpected error, please try again',
    already_purchased: 'You have already purchased this extension',
    extension_beta_only: 'This extension is exclusive to beta testers',
    user_not_found: 'The user does not exist',
  },
  placeholders: {
    email: 'you@email.com',
    password: '••••••••',
    id: '123456789',
    phone: '+57 300 123 4567',
  },
  'select.default': {
    placeholder: 'Select...',
  },
  'extensions.search': {
    placeholder: 'Search extensions...',
    search_aria: 'Search extensions',
    clear_aria: 'Clear search',
    empty_results: 'No results found for "{{query}}".',
  },
  cart: {
    title: 'Your cart',
    close_aria: 'Close cart',
    aria_label: 'Shopping cart',
    empty_title: 'Your cart is empty',
    empty_subtitle: 'Add expansion packs to see them here.',
    explore_cta: 'Explore packs',
    remove_aria: 'Remove item',
    clear_cta: 'Clear cart',
    total_label: 'Total',
    order_summary: 'Order summary',
    packages_count: '{{count}} package',
    packages_count_plural: '{{count}} packages',
    checkout_cta: 'Proceed to checkout',
    checkout_processing: 'Processing purchase...',
    checkout_success: 'Purchase completed successfully!',
    checkout_success_title: 'Thank you for your purchase!',
    checkout_success_subtitle: 'Your expansion packs are now available.',
    checkout_success_items: '{{count}} pack(s) purchased',
    checkout_success_total: 'Total paid',
    checkout_success_close: 'Close',
    checkout_success_explore: 'Continue exploring',
    checkout_error_title: 'Purchase error',
    checkout_error_subtitle: 'Could not complete order.',
    checkout_error_retry: 'Retry',
    checkout_error_continue: 'Continue shopping',
    checkout_error_close: 'Close',
    login_required: 'Log in to view your cart',
    login_link: 'Go to login',
    platform_label: 'Platform',
    language_label: 'Language',
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

    async function loadAll(currentLang = lang.get()) {
      try {
        const activeFallback = currentLang === 'en' ? FALLBACK_EN : FALLBACK
        const sectionResults = await Promise.allSettled(
          SECTIONS.map((key) => getContentBySection(key, currentLang))
        )

        if (cancelled) return

        const mergedSections = {}
        SECTIONS.forEach((sectionKey, i) => {
          const sectionFallback = activeFallback[sectionKey] || FALLBACK[sectionKey] || {}
          const result = sectionResults[i]
          let mapped = {}
          if (result && result.status === 'fulfilled' && result.value?.items) {
            mapped = mapItemsToObj(result.value.items)
          }
          mergedSections[sectionKey] = {
            ...sectionFallback,
            ...mapped,
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

    loadAll(lang.get())

    const unsubscribe = lang.onChange((newLang) => {
      if (!cancelled) loadAll(newLang)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
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
