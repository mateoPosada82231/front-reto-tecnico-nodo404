# Los Sims 4 - Expansion Store

Tienda de expansiones de Los Sims 4. Frontend en React consumiendo una API REST en Spring Boot.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 19 | UI library |
| **Vite** | 8 | Build tool + dev server |
| **Tailwind CSS** | v4 | Utility-first CSS |
| **pnpm** | - | Gestor de paquetes |
| **react-router-dom** | 7 | Enrutamiento SPA |
| **lucide-react** | - | Iconografía |
| **oxlint** | - | Linter |

---

## Estructura del proyecto

```
src/
├── app/                        # Configuración de app y router
│   ├── App.jsx                 # Root component, envuelve en ContentProvider + MainLayout
│   └── router.jsx              # Definición de rutas (lazy loading)
│
├── features/                   # Agrupación por funcionalidad (Folder Feature)
│   ├── auth/                   # Autenticación
│   │   ├── components/         # LoginForm, RegisterForm, SocialButtons, etc.
│   │   ├── hooks/              # useLoginForm, useRegisterForm
│   │   └── pages/              # LoginPage, RegisterPage, OAuthCallback
│   │
│   └── landing/                # Landing page
│       ├── components/         # HeroSection, ExpansionGrid, Card, WelcomeModal
│       ├── context/            # ExtensionsContext (datos de extensiones)
│       ├── hooks/              # useExtensionsData, useHeroSection, useExpansionGrid
│       └── pages/              # LandingPage
│
├── shared/                     # Componentes, hooks y servicios compartidos
│   ├── components/             # Header, Footer, Button, InputField, Logo, etc.
│   ├── context/                # ContentContext (sistema de contenido dinámico)
│   ├── hooks/                  # useAuth, useHeader, useTheme, useContent, useConfig
│   └── services/               # Llamadas API: auth.js, users.js, extensions.js, content.js
│
├── data/                       # Datos mock/estáticos (expansionPacks.js, packMedia.js)
│
└── assets/                     # Imágenes estáticas
```

---

## Sistema de contenido dinámico

Todos los textos de UI (títulos, labels, botones, mensajes) provienen de la base de datos a través de la API `/api/content`. El frontend usa un **ContentProvider** global que carga todas las secciones al iniciar la app.

### Arquitectura

```
API /api/content/{section}  ──►  ContentContext  ──►  useContent('section.key')  ──►  Componente
API /api/config/{key}       ──►  ContentContext  ──►  useConfig('key')           ──►  Componente
```

### Hooks disponibles

| Hook | Uso | Retorna |
|---|---|---|
| `useContent(sectionKey)` | Obtener textos de una sección | `{ content, loading, error }` |
| `useConfig(configKey)` | Obtener configuración (ej: países) | `{ config, loading, error }` |

### Ejemplo de uso

```jsx
import useContent from '../shared/hooks/useContent'

function LoginPage() {
  const { content, loading } = useContent('auth.login')

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
    </div>
  )
}
```

### Secciones de contenido

| Sección | Keys | Descripción |
|---|---|---|
| `landing.hero` | `cta_text`, `error_prefix`, `prev_aria`, `next_aria`, `slide_aria_prefix` | Carrusel hero |
| `landing.grid` | `title`, `error_prefix`, `cta_text` | Grilla de productos |
| `landing.welcome` | `title`, `subtitle`, `cta_text`, `close_aria` | Modal de bienvenida |
| `auth.login` | `title`, `subtitle`, `email_label`, `password_label`, `submit_text`, `loading_text`, `success_message` | Formulario login |
| `auth.register` | `title`, `subtitle`, labels, placeholders, `submit_text`, `loading_text`, `success_message` | Formulario registro |
| `auth.social` | `divider_login`, `divider_register` | Botones OAuth |
| `auth.oauth` | `loading_text` | Callback OAuth |
| `header` | `profile_warning`, `nav_home`, `nav_register`, `nav_login`, `beta_cta`, `logout_aria`, `menu_aria` | Navegación |
| `beta_modal` | `close_aria`, `already_title`, `already_description`, `already_cta`, `confirm_title`, `confirm_description`, `cancel_text`, `processing_text`, `confirm_cta` | Modal beta tester |
| `footer` | `copyright` | Footer |
| `common` | `loading_aria` | Textos compartidos |

### Configuraciones

| Key | Contenido |
|---|---|
| `countries` | Lista de países `[{ value, label }]` |

### Fallback

Si la API no está disponible, el sistema usa valores por defecto hardcodeados en `ContentContext.jsx` para que la app siga funcionando.

---

## Convenciones

- **Mobile First**: CSS base para mobile, `@media (min-width: ...)` para desktop
- **BEM**: solo cuando no se use Tailwind (`Bloque__Elemento--Modificador`)
- **User Feedback obligatorio**: loading, empty, error states y transiciones en toda interacción
- **Folder Feature**: usar la estructura folder feature y desacoplar la lógica de los componentes
- **Contenido dinámico**: todos los textos de UI deben usar `useContent()` o `useConfig()`, nunca hardcodear strings

---

## API

Documentación completa de endpoints en `endpoints.md`.

- **Auth**: registro/login local + OAuth2 (Google, Facebook)
- **Content CMS** (`/api/content`): CRUD de textos de UI (lectura pública, escritura admin)
- **Config CMS** (`/api/config`): CRUD de configuraciones (lectura pública, escritura admin)
- **Extensions** (`/api/extensions`): catálogo de productos (lectura pública, escritura admin)
- **Users** (`/api/users`): gestión de usuario (protegido)
- **Cart** (`/api/cart`): carrito de compras (protegido + ownership)
- **Buys** (`/api/buys`): historial de compras (protegido)

---

## Scripts

```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build producción
pnpm preview    # Preview del build
pnpm lint       # Ejecutar oxlint
```

---

## Buenas prácticas de Git

- **Ramas**: `feature/`, `fix/`, `refactor/` como prefijos
- **Commits atómicos**: un commit por cambio lógico
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`
- **PRs pequeños**: mantener Pull Requests enfocadas en un solo propósito
- **No commitear secrets**: usar `.env` local y `.gitignore`
