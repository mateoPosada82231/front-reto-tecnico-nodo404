# Los Sims 4 — Expansion Store

Tienda de expansiones de Los Sims 4. Frontend en React 19 + Vite consumiendo una API REST en Spring Boot (`localhost:8080`), con un CMS ligero para textos de UI orientado a internacionalización futura.

---

## Tabla de contenidos

- [Stack](#stack)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas](#rutas)
- [Servicios API](#servicios-api)
- [Sistema de contenido dinámico](#sistema-de-contenido-dinámico)
- [Manejo de errores amigables](#manejo-de-errores-amigables)
- [Convenciones](#convenciones)
- [Variables de entorno](#variables-de-entorno)
- [Buenas prácticas de Git](#buenas-prácticas-de-git)

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 19 | UI library |
| **Vite** | 8 | Build tool + dev server |
| **Tailwind CSS** | v4 | Utility-first CSS |
| **pnpm** | — | Gestor de paquetes |
| **react-router-dom** | 7 | Enrutamiento SPA (lazy + Suspense) |
| **zustand** | 5 | State management (con `persist` para sesión) |
| **lucide-react** | — | Iconografía |
| **oxlint** | — | Linter (Oxidation compiler) |

---

## Scripts

```bash
pnpm dev       # Servidor de desarrollo (Vite)
pnpm build     # Build producción (Vite)
pnpm preview   # Preview del build
pnpm lint      # Ejecutar oxlint
```

---

## Estructura del proyecto

```
src/
├── app/                              # Configuración de app
│   ├── App.jsx                       # Root: envuelve en ContentProvider + MainLayout
│   └── router.jsx                   # Definición de rutas (lazy loading)
│
├── features/                         # Folder Feature (lógica por dominio)
│   ├── auth/
│   │   ├── components/               # InputField, SelectField, Alert, SocialButtons, LoginForm, RegisterForm
│   │   ├── hooks/                    # useLoginForm, useRegisterForm
│   │   └── pages/                    # LoginPage, RegisterPage, OAuthCallback
│   │
│   ├── landing/
│   │   ├── components/               # HeroSection, ExpansionGrid, Card, WelcomeModal
│   │   ├── context/                  # ExtensionsContext (datos de extensiones)
│   │   ├── hooks/                    # useExtensionsData, useHeroSection, useExpansionGrid
│   │   └── pages/                    # LandingPage
│   │
│   └── profile/
│       ├── components/               # ProfileAvatar
│       ├── hooks/                    # useProfile
│       └── pages/                    # ProfilePage
│
├── shared/                           # Código compartido entre features
│   ├── components/                   # Header, Footer, Button, InputField, Checkbox, Skeleton,
│   │                                 # Logo, ThemeToggle, BetaTesterModal, MainLayout, SocialIcons
│   ├── context/                      # ContentContext + ContentProvider
│   ├── hooks/                        # useHeader, useTheme, useContent, useConfig
│   ├── services/                     # auth, users, extensions, content, httpClient
│   ├── stores/                       # useAuthStore (sesión con persist), useUsersStore (emails para validación)
│   └── utils/                        # errors (getFriendlyError), crypto
│
├── data/                             # Datos mock/seed (expansionPacks.js, packMedia.js)
└── assets/                           # Imágenes estáticas
```

### Componentes reutilizables (en `shared/components/`)

| Componente | Variantes / props clave | Notas |
|---|---|---|
| `Button` | `primary` \| `secondary` \| `ghost`, `loading`, `href`, `disabled` | Soporta `<a>` cuando se pasa `href`. Internamente incluye todos los estilos base. |
| `InputField` | `label`, `error`, `required`, `className` | Wrapper `<div className="flex flex-col gap-1.5">`. Usado por login, registro y perfil. |
| `Checkbox` | `label`, `checked`, `error` | Misma estructura que InputField. |
| `Skeleton` | `className` | Incluye `animate-pulse rounded-xl bg-surface` + `loading_aria` desde `common.loading_aria`. |
| `Alert` | `success` \| `error` \| `info` | Icono + color ya incluidos. |
| `BetaTesterModal` | `open`, `loading`, `success`, `error` | Modal controlado; usa `useContent('beta_modal')` y `Button` internamente. |
| `ThemeToggle` | `theme`, `onToggle` | ARIA labels desde `theme.toggle`. |
| `Logo` / `Header` / `Footer` / `MainLayout` / `SocialIcons` | — | Wrappers/layout. |

> **Convención**: cualquier estilo base (color, padding, transición, focus) debe vivir dentro del componente. Las páginas solo agregan clases de layout (grid, flex, spacing, max-w, mx-auto, etc.) o estilos estrictamente únicos de esa pantalla.

---

## Rutas

| Path | Componente | Acceso | Lazy |
|---|---|---|---|
| `/` | `LandingPage` | Público | No |
| `/registro` | `RegisterPage` | Público | Sí |
| `/login` | `LoginPage` | Público | Sí |
| `/oauth2/callback` | `OAuthCallback` | Público | Sí |
| `/perfil` | `ProfilePage` | Protegido (redirige a `/login` si no hay sesión) | Sí |

Las páginas perezosas se envuelven en `<Suspense>` dentro de `app/router.jsx`.

---

## Servicios API

Todos los servicios viven en `src/shared/services/`. Usan `httpClient.js` que añade `Authorization: Bearer <JWT>` a las peticiones no públicas, leyendo el token desde `useAuthStore` (zustand persist) — no se usa `localStorage` directamente.

| Servicio | Archivo | Funciones | Auth |
|---|---|---|---|
| Auth | `auth.js` | `getRegisteredEmails()`, `register(data)`, `login(email, password)`, `logout()` | Mixto |
| Users | `users.js` | `getUsers()`, `getUserByEmail(email)`, `updateUser(email, data)` | Bearer |
| Extensions | `extensions.js` | `getExtensions`, `getExtensionById`, `getByCategory`, `getByDistributor`, `getByAge`, `getTrending`, `getRandom` | Público |
| Content (CMS) | `content.js` | `getContentBySection`, `getContentByKey`, `createContent`, `updateContent`, `deleteContent` | GET público / escritura Bearer |
| Config (CMS) | `content.js` | `getConfig`, `createConfig`, `updateConfig`, `deleteConfig` | GET público / escritura Bearer |

Detalle de cada endpoint en [`endpoints.md`](./endpoints.md).

### Endpoints públicos (sin token)

El `httpClient` marca como públicos (sin `Authorization` ni `X-Encrypted`) los patrones: `/api/extensions`, `/api/content`, `/api/config` y `/api/auth/emails`. Los endpoints de `register`/`login`/`beta` sí soportan cifrado aunque sean públicos.

---

## State management (zustand)

| Store | Archivo | Propósito |
|---|---|---|
| `useAuthStore` | `shared/stores/useAuthStore.js` | Sesión del usuario. Persiste `token`, `email`, `user`, `profileComplete`, `isBetaTester` en `localStorage` (key `auth-storage`) vía `persist`. El flag `isLoggedIn` se **deriva** del token en la hidratación (`merge` en el middleware). Acciones: `setAuth`, `fetchUser`, `logout`, `setUser`. |
| `useUsersStore` | `shared/stores/useUsersStore.js` | Lista de emails ya registrados, cargados una sola vez desde `GET /api/auth/emails`. `isEmailRegistered(email)` valida duplicados en memoria (sin hits a la BD). `addEmail` tras registros exitosos. |
| `useLoginFormStore` | `features/auth/stores/useLoginFormStore.js` | Estado del form de login (campos, errors, loading, success). Llama a `useAuthStore.setAuth` tras login OK. |
| `useRegisterFormStore` | `features/auth/stores/useRegisterFormStore.js` | Estado del form de registro. Valida email duplicado contra `useUsersStore` antes de enviar al backend. Tras éxito, hace `addEmail` al store para mantener sincronizada la lista. |

> **Nota sobre auth**: el token vive únicamente en `useAuthStore` (persist). El `httpClient` lo lee vía `useAuthStore.getState().token`. No hay escrituras manuales a `localStorage` ni se usa el key suelto `token`. Headers, servicios y el header UI consumen el store; tras login por formulario (`useLoginFormStore`) o OAuth (`OAuthCallback.jsx` → `useAuthStore.setAuth`) la sesión se refleja reactivamente.

### Flujo de autenticación

**Login por formulario** (`features/auth/pages/LoginPage.jsx` → `useLoginFormStore` → `login(email, password)` de `auth.js`): el backend devuelve `{ token }`. El store llama a `useAuthStore.setAuth(token, email)`, que setea `token`/`email`/`isLoggedIn` y dispara `fetchUser()` (`GET /api/users/{email}`) para poblar `user`, `profileComplete` y `isBetaTester`. El Header (`useHeader`) ya muestra la sesión reactivamente.

**Login por OAuth2** (`SocialButtons` redirige a `/oauth2/authorization/{provider}`): el backend completa el flujo OAuth2 y `OAuth2SuccessHandler` redirige a `${FRONTEND_URL}/oauth2/callback?token=...&email=...`. `OAuthCallback.jsx` lee los query params y llama a `useAuthStore.setAuth(token, email)` — mismo camino que el formulario.

**Validación de email en registro**: `RegisterForm.jsx` monta y dispara `useUsersStore.loadEmails()` (`GET /api/auth/emails`). El validator de `useRegisterFormStore` consulta `isEmailRegistered(email)` en memoria — sin peticiones a la BD por cada intento. El mensaje de error usa la key `validation.register.email_already_registered` del CMS. Tras un registro exitoso, `addEmail(email)` mantiene la cache en sincronía.

### Actualización de perfil

`ProfilePage.jsx` → `useProfile.saveProfile` envía un payload que **combina los campos editables** del form con `provider` y `betaTester` del usuario existente, para que el backend pueda deserializar el body a la entidad `Users` sin romper (los campos primitivos no pueden venir null).

---

## Sistema de contenido dinámico

**Regla de oro**: ningún texto visible para el usuario se hardcodea en componentes ni hooks (incluidos mensajes de validación y errores del servidor). Todo proviene de la base de datos a través del CMS o de mensajes internacionales listos para i18n.

### Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    ContentProvider                       │
│  (carga TODAS las secciones + configs al iniciar la app)│
├─────────────────────────────────────────────────────────┤
│  useContent('auth.login')  →  { title, subtitle, ... }  │
│  useConfig('countries')    →  [{ value, label }, ...]   │
└─────────────────────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
     GET /api/content/{section}   GET /api/config/{key}
              │                     │
              └──────────┬──────────┘
                         │
                    Backend API
                    (localhost:8080)
```

- Al iniciar, `ContentProvider` hace `Promise.allSettled` de `getContentBySection(section)` para todas las secciones registradas, y `getConfig(key)` para todas las configs. Si una sección falla, se conserva el fallback local.
- El merge `FALLBACK ∪ backend` se hace sección por sección (`FALLBACK` manda si la API no devuelve la clave).
- `useContent()` y `useConfig()` leen de un `Context` (no hacen requests por separado). Esto evita waterfall y mantiene el contenido sincronizado.

### Hooks disponibles

| Hook | Retorna | Uso |
|---|---|---|
| `useContent(sectionKey)` | `{ content, loading, error }` | Textos editoriales (títulos, labels, placeholders, mensajes). |
| `useConfig(configKey)` | `{ config, loading, error }` | Listas estructuradas (ej: `countries`). |

### Ejemplo

```jsx
import useContent from '../shared/hooks/useContent'

function LoginPage() {
  const { content } = useContent('auth.login')
  return <h1>{content.title}</h1>
}
```

### Secciones de contenido registradas

| Sección | Keys | Descripción |
|---|---|---|
| `landing.hero` | `cta_text`, `error_prefix`, `prev_aria`, `next_aria`, `slide_aria_prefix` | Carrusel hero |
| `landing.grid` | `title`, `error_prefix`, `cta_text` | Grilla de productos |
| `landing.welcome` | `title`, `subtitle`, `cta_text`, `close_aria` | Modal de bienvenida |
| `auth.login` | `title`, `subtitle`, `email_label`, `password_label`, `submit_text`, `loading_text`, `success_message` | Formulario de login |
| `auth.register` | `title`, `subtitle`, `fullname_label`, `fullname_placeholder`, `email_label`, `country_label`, `birthdate_label`, `id_label`, `phone_label`, `password_label`, `password_placeholder`, `confirm_password_label`, `confirm_password_placeholder`, `submit_text`, `loading_text`, `success_message` | Formulario de registro |
| `auth.social` | `divider_login`, `divider_register` | Botones OAuth |
| `auth.oauth` | `loading_text` | Callback OAuth |
| `header` | `profile_warning`, `nav_home`, `nav_register`, `nav_login`, `beta_cta`, `logout_aria`, `menu_aria`, `profile_link_aria`, `beta_badge_label`, `mobile_profile_link` | Navegación |
| `beta_modal` | `close_aria`, `already_title`, `already_description`, `already_cta`, `confirm_title`, `confirm_description`, `cancel_text`, `processing_text`, `confirm_cta` | Modal beta tester |
| `footer` | `copyright` | Footer |
| `common` | `loading_aria` | Textos compartidos |
| `profile.page` | `name_fallback`, `beta_badge`, `fullname_label`, `country_label`, `identification_label`, `phone_label`, `birthdate_label`, `edit_button`, `cancel_button`, `save_button`, `success_message`, `error_message` | Página `/perfil` |
| `theme.toggle` | `light_aria`, `dark_aria` | Botón de tema claro/oscuro |
| `validation.login` | `email_required`, `email_invalid`, `password_required` | Validaciones del formulario de login |
| `validation.register` | `name_required`, `email_required`, `email_invalid`, `email_already_registered`, `country_required`, `birthdate_required`, `id_required`, `phone_required`, `password_required`, `password_min_length`, `password_uppercase`, `password_number`, `password_special`, `confirm_required`, `confirm_match` | Validaciones del registro |
| `validation.profile` | `name_required` | Validaciones del perfil |
| `errors.common` | `duplicate_email`, `invalid_credentials`, `session_expired`, `unauthorized`, `required_field`, `validation_failed`, `server_error`, `service_unavailable`, `bad_request`, `not_found`, `network_error`, `unexpected_error` | Mensajes de error amigables |
| `placeholders` | `email`, `password`, `id`, `phone` | Placeholders de inputs |
| `select.default` | `placeholder` | Opción por defecto de `<SelectField>` |

### Configuraciones

| Key | Contenido |
|---|---|
| `countries` | Lista de países `[{ value, label }]` (usado en formulario de registro y perfil) |

### Cómo agregar una nueva sección

1. **Agregar fallback en `FALLBACK`** dentro de `ContentProvider.jsx`.
2. **Agregar la clave al array `SECTIONS`** del mismo archivo.
3. **Insertar los registros** en la base de datos (`INSERT INTO site_content ...` con `section_key`, `content_key`, `content_value`).
4. **Consumir** en el componente con `useContent('nueva.seccion')`.

### Cómo agregar una nueva configuración

1. Agregar el fallback en `FALLBACK_CONFIG` y la clave al array `CONFIG_KEYS`.
2. Insertar en BD (`INSERT INTO site_config ...`).
3. Consumir con `useConfig('clave')`.

---

## Manejo de errores amigables

El módulo `src/shared/utils/errors.js` mapea los mensajes crudos del backend (español o inglés) y los códigos HTTP a mensajes amigables **traducibles desde el CMS**.

### API

```js
import { getFriendlyError } from '../shared/utils/errors'

getFriendlyError(messages, err) // -> string
```

- `messages`: objeto con las claves de la sección `errors.common` (ej: `{ duplicate_email, invalid_credentials, ... }`).
- `err`: el `Error` lanzado por `httpClient` o por el servicio.

### Estrategia de mapeo

1. **Lookup por keyword** en `ERROR_KEYS`: si el `message` del error contiene alguna de las palabras clave registradas (case-insensitive), retorna `messages[key]`.
2. **Lookup por código HTTP** en el string (`'400'`, `'401'`, etc.).
3. **Lookup por error de red** (`Failed to fetch`, `NetworkError`).
4. **Fallback**: si el mensaje es muy largo (>100 chars) usa `messages.unexpected_error`; si no, devuelve el mensaje crudo.

### Uso en hooks

Los hooks `useLoginForm`, `useRegisterForm`, `useProfile` y `useHeader` leen `errors.common` con `useContent` y lo pasan a `getFriendlyError`:

```js
const { content: errorsContent } = useContent('errors.common')
// ...
setServerError(getFriendlyError(errorsContent, err))
```

Esto permite traducir los mensajes de error del backend sin tocar el `httpClient` ni los servicios.

---

## Convenciones

- **Mobile First**: CSS base para mobile, `@media (min-width: ...)` para desktop.
- **BEM**: solo cuando no se use Tailwind (`Bloque__Elemento--Modificador`).
- **User Feedback obligatorio**: loading, empty, error states y transiciones en toda interacción.
- **Folder Feature**: agrupar por dominio (`features/auth/`, `features/profile/`, etc.) y desacoplar la lógica en `hooks/`.
- **Contenido dinámico**: TODO texto visible para el usuario pasa por `useContent()` / `useConfig()`. Esto incluye:
  - Títulos, subtítulos, labels, placeholders.
  - Mensajes de éxito/error de operaciones.
  - Mensajes de validación de formularios.
  - Mensajes de error amigables del servidor.
  - ARIA labels (accesibilidad es contenido editorial).
- **Componentes reutilizables**: nunca redefinir estilos que ya existen en el componente (`Button`, `InputField`, etc.). Solo agregar clases de layout.
- **No comentarios** salvo que se pidan explícitamente.
- **Sin emojis** en código salvo petición explícita.

---

## Variables de entorno

```bash
# .env (raíz del proyecto)
VITE_ENCRYPTION_KEY=<Base64 32 bytes>
```

Esta clave se usa en `src/shared/utils/crypto.js` para cifrar payloads sensibles (AES-256-GCM). Debe coincidir con la del backend (`ENCRYPTION_KEY`).

El proxy de Vite (`vite.config.js`) reenvía `/api`, `/oauth2/authorization` y `/login/oauth2/code` a `http://localhost:8080`, evitando problemas de CORS en desarrollo.

---

## API

Documentación completa de endpoints, autenticación, cifrado y rate limiting en [`endpoints.md`](./endpoints.md).

---

## Buenas prácticas de Git

- **Ramas**: `feature/`, `fix/`, `refactor/`, `chore/` como prefijos.
- **Commits atómicos**: un commit por cambio lógico.
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- **PRs pequeños**: mantener Pull Requests enfocadas en un solo propósito.
- **No commitear secrets**: usar `.env` local y mantenerlo en `.gitignore`.
