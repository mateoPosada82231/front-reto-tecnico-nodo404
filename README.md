# Nodo Store — Los Sims 4 Expansion Store

Plataforma e‑commerce (catálogo + carrito + compras) para expansiones de Los Sims 4, con sistema de usuarios, autenticación local y OAuth2 (Google/Facebook), programa **Beta Tester**, CMS de contenidos de UI internacionalizable, panel de administración, y cifrado extremo a extremo (AES‑256‑GCM) de payloads sensibles.

El proyecto es un **monorepo de dos aplicaciones**:

| Carpeta | App | Rol |
|---|---|---|
| `front-reto-tecnico-nodo404/` | Frontend SPA | React 19 + Vite |
| `reto-tecnico-nodo-nodo404/` | Backend REST | Spring Boot 4 (Java 21) |

> Este README documenta **toda la aplicación** (backend + frontend + base de datos + despliegue) y sirve como base para la exposición del proyecto.

---

## Tabla de contenidos

- [Visión general](#visión-general)
- [Arquitectura](#arquitectura)
- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Modelo de datos](#modelo-de-datos)
- [Backend](#backend)
  - [Estructura](#estructura-del-backend)
  - [Seguridad](#seguridad-del-backend)
  - [Cifrado AES‑256‑GCM](#cifrado-aes256gcm)
  - [Emails (Resend)](#emails-resend)
  - [Endpoints](#endpoints-del-backend)
  - [Configuración](#configuración-del-backend)
- [Frontend](#frontend)
  - [Estructura](#estructura-del-frontend)
  - [Rutas](#rutas)
  - [Servicios API y httpClient](#servicios-api-y-httpclient)
  - [State management (zustand)](#state-management-zustand)
  - [Flujo de autenticación](#flujo-de-autenticación)
  - [Sistema de contenido dinámico (CMS)](#sistema-de-contenido-dinámico-cms)
  - [Internacionalización](#internacionalización)
  - [Manejo de errores amigables](#manejo-de-errores-amigables)
  - [Tema claro/oscuro](#tema-clarooscuro)
- [Despliegue](#despliegue)
  - [Arquitectura de despliegue](#arquitectura-de-despliegue)
  - [Variables de entorno](#variables-de-entorno)
  - [OAuth2 en producción](#oauth2-en-producción)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [Semilla de datos](#semilla-de-datos)
- [Pruebas](#pruebas)
- [Convenciones y decisiones técnicas](#convenciones-y-decisiones-técnicas)

---

## Visión general

**Nodo Store** es una tienda de extensiones (paquetes) del juego Los Sims 4. Permite:

- Explorar un catálogo de expansiones con imágenes, descripciones, categorías, plataformas, idiomas, distribuidor, precio, edad requerida y fecha de publicación.
- Ver detalle de cada expansión.
- Registrarse / iniciar sesión por **formulario** o por **OAuth2** (Google, Facebook).
- Programa **Beta Tester**: usuarios que pueden acceder a expansiones exclusivas (`isPublic=false`).
- Agregar extensiones a un **carrito** y **comprar** (compra directa o checkout del carrito completo).
- Ver el **perfil** y el historial de **compras**.
- **CMS ligero** de contenidos de UI (`site_content`) y configuraciones estructuradas (`site_config`), ambos editables vía API y consumidos por el frontend.
- **Panel de administración** (`/admin`): listar beta testers, ver estadísticas de compras por extensión, enviar broadcast a beta testers y promover administradores.
- Recuperación de contraseña por email (link firmado con JWT de un solo uso, 15 min).
- **Cifrado extremo a extremo** opcional de payloads sensibles (registro, login, usuarios, carrito, compras) con AES‑256‑GCM.
- **Internacionalización** ES/EN de todo el contenido editorial y de las extensiones (la BD es la única fuente de traducciones).
- **Tema claro/oscuro**.
- **Rate limiting** en endpoints de autenticación.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│              Navegador  (React SPA — Vercel)                 │
│  https://nodo404.vercel.app                                  │
│  - Rutas: /  /registro  /login  /expansion/:id  /perfil      │
│           /oauth2/callback  /forgot-password  /reset-password │
│           /admin                                             │
│  - httpClient: JWT (Bearer) + AES-GCM opcional (Web Crypto)  │
│  - zustand: sesión (persist) + emails (validación local)     │
│  - ContentProvider: carga textos desde /api/content (CMS)     │
└─────────────────────────────────────────────────────────────┘
       │ /api/*  /oauth2/authorization/*  /login/*   (mismo origen)
       │   En dev: proxy de Vite a localhost:8080
       │   En prod: rewrites de Vercel a Render
       ▼
┌─────────────────────────────────────────────────────────────┐
│        Backend REST  (Spring Boot 4 — Render)                │
│  https://reto-tecnico-api-60f1.onrender.com                   │
│  - Seguridad: Spring Security + JWT + OAuth2 (Google/FB)      │
│  - Filtros: rate limit → cifrado request → JWT → cifrado resp │
│  - JPA/Hibernate + PostgreSQL                                │
│  - Resend (emails transaccionales)                           │
└─────────────────────────────────────────────────────────────┘
       │ JDBC (pooler session, sslmode=require)
       ▼
┌─────────────────────────────────────────────────────────────┐
│             Base de datos  (PostgreSQL — Supabase)           │
│  users · extensions · extension_translations · buys          │
│  cart_items · site_content · site_config                     │
└─────────────────────────────────────────────────────────────┘
```

El frontend habla con el backend **siempre en el mismo origen** (en desarrollo vía el proxy de Vite; en producción vía `rewrites` de Vercel). Esto evita problemas de CORS sin necesidad de configurarlo en el backend.

---

## Stack

### Frontend (`front-reto-tecnico-nodo404/`)

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool + dev server |
| Tailwind CSS | v4 | Utility‑first CSS (plugin `@tailwindcss/vite`, minify con `lightningcss`) |
| react-router-dom | 7 | Enrutado SPA (lazy + Suspense) |
| zustand | 5 | State management (`persist` para sesión) |
| lucide-react | — | Iconografía |
| oxlint | — | Linter |
| pnpm | — | Gestor de paquetes |

### Backend (`reto-tecnico-nodo-nodo404/`)

| Tecnología | Versión | Uso |
|---|---|---|
| Java | 21 | Lenguaje |
| Spring Boot | 4.0.3 | Framework (parent) |
| Spring Modulith | 2.0.7 | Organización modular |
| Spring Security | — | AuthN/AuthZ, OAuth2 Client |
| Spring Data JPA / Hibernate | 7.2 | Persistencia |
| PostgreSQL Driver | 42.7 | Conexión a BD |
| jjwt | 0.12.6 | JWT (HS256) |
| Resend Java SDK | 4.13.0 | Envío de emails transaccionales |
| Lombok | — | Boilerplate |
| Jackson | — | JSON |
| H2 | — | Base en memoria para tests |
| Maven Wrapper | — | Build |

### Infraestructura / Deploy

| Servicio | Rol |
|---|---|
| Vercel | Hosting del frontend (static + rewrites) |
| Render | Hosting del backend (web service Docker, blueprint `render.yaml`) |
| Supabase | PostgreSQL gestionado (pooler en modo session) |
| Resend | Emails transaccionales |
| Cloudinary | Alojamiento de imágenes de extensiones (referenciadas en `data.sql`) |

---

## Funcionalidades

### Autenticación y usuarios

- **Registro local** (`POST /api/auth/register`): crea usuario `provider=FORM`, `betaTester=false`. Envía email de bienvenida.
- **Login local** (`POST /api/auth/login`): valida credenciales y devuelve `{ token }` (JWT `type=USER`).
- **OAuth2 (Google / Facebook)**: flujo Authorization Code con PKCE. `OAuth2SuccessHandler` genera un JWT y redirige al frontend en `${FRONTEND_URL}/oauth2/callback?token=...&email=...`.
- **Beta Tester**: no hay registro/login beta separado. Un usuario ya autenticado se une al programa desde el **Header** (botón "Ser Beta Tester" → `BetaTesterModal`) que llama a `PUT /api/users/{email}` con `betaTester: true`. El backend lo promueve y envía el email de bienvenida al programa. Los beta testers pueden comprar expansiones exclusivas (`isPublic=false`). (El backend aún expone `/api/auth/beta/*` y variants OAuth2 `*-beta` que emiten JWT `type=BETA`, pero el frontend no las usa.)
- **Logout** (`POST /api/auth/logout`): revoca el JWT añadiéndolo a una lista negra in‑memory (`TokenRevocationService`) hasta su expiración natural.
- **Recuperar contraseña**: `POST /api/auth/forgot-password` genera un JWT `type=RESET` (15 min) y envía un link `${FRONTEND_URL}/reset-password?token=...`. `POST /api/auth/reset-password` valida el token y cambia la contraseña (BCrypt). Por seguridad, la respuesta de forgot‑password es idéntica exista o no el email.
- **Validación de emails en cliente**: `GET /api/auth/emails` devuelve la lista de emails ya registrados; el frontend la carga una sola vez y valida duplicados en memoria (store de zustand) sin tocar la BD en cada intento.
- **Perfil**: `GET /api/users/{email}`, `PUT /api/users/{email}`. Al promover un usuario a beta tester (`betaTester: false → true`) el backend envía email de bienvenida al programa beta.
- **Roles**: `ROLE_USER`, `ROLE_BETA_TESTER`, `ROLE_ADMIN`. El flag `admin` en la entidad `Users` se traduce a `ROLE_ADMIN` vía `UserDetailsServiceImpl`.

### Catálogo de extensiones

- Listado, detalle, filtros por categoría / distribuidor / edad, `trending` y `random`.
- Campos localizables (name, aboutGame, category, platforms, languages, distributor) viven en `extension_translations` (una fila por `extension_id` + `language`). Endpoints GET aceptan `?language=es|en` con **fallback a ES**.
- `isPublic` (default `false`): si es `false`, la extensión es **exclusiva beta**. El listado público la incluye (con etiqueta "Beta" en el frontend), pero la compra / carrito devuelven `403 extension_beta_only` si el usuario autenticado no es `betaTester=true`.

### Carrito y compras

- **Carrito** (`/api/cart`): agregar, listar (con extensiones traducucidas según `?language=`), eliminar item, limpiar. Reglas de **ownership**: el `email` del request debe coincidir con el del JWT, si no → `403 Forbidden`.
- **Compras** (`/api/buys`):
  - `POST /api/buys/direct`: compra directa de una extensión (requiere `language` y `platform`).
  - `POST /api/buys/checkout`: convierte todo el carrito en compras y lo vacía.
  - `GET /api/buys/user/{email}?language=`: historial del usuario.
- Mismas reglas de ownership y de extensión beta‑only.

### CMS de contenidos

- **`/api/content`** (CRUD de textos de UI): GET público (con cache de 5 min); POST/PUT/DELETE protegidos (admin). Sección + clave + idioma, con unique constraint `(section_key, content_key, language)`.
- **`/api/config`** (configuraciones estructuradas en JSON, ej. `countries`): GET público (cache 5 min); POST/PUT/DELETE protegidos.

### Administración

- `GET /api/admin/users/beta` — lista beta testers.
- `GET /api/admin/extensions/stats` — estadísticas de compras por extensión.
- `POST /api/admin/broadcast` — envía un email a todos los beta testers.
- `POST /api/admin/users/promote` — promueve un usuario a `admin`.

Todo el controlador `AdminController` está protegido con `@PreAuthorize("hasRole('ADMIN')")` (method security).

### Email transaccionales (Resend)

Plantillas HTML en `src/main/resources/templates/`:

| Plantilla | Evento |
|---|---|
| `email-welcome.html` | Registro (USER o BETA) / promoción a beta tester |
| `email-password-reset.html` | Recuperación de contraseña |
| `email-password-changed.html` | Confirmación de cambio de contraseña |
| `email-purchase.html` | Confirmación de compra |
| `email-broadcast.html` | Broadcast del admin a beta testers |

Remitente: `onboarding@resend.dev` (dominio compartido de Resend para pruebas).

---

## Modelo de datos

Esquema gestionado por Hibernate (`ddl-auto: update`). Tablas principales:

### `users`
PK: `email`. Campos:

| Columna | Tipo | Notas |
|---|---|---|
| `email` | VARCHAR(255) | PK (login) |
| `password` | VARCHAR | **BCrypt**, `@JsonProperty(WRITE_ONLY)` (no se expone) |
| `country` | VARCHAR | País (código, ej. `CO`) |
| `date_of_birth` | DATE | Fecha de nacimiento |
| `date_of_admission` | DATE | Fecha de alta |
| `identification` | VARCHAR | **Cifrado AES‑256‑GCM at‑rest** (`EncryptionAttributeConverter`) |
| `full_name` | VARCHAR | **Cifrado AES‑256‑GCM at‑rest** |
| `mobile_number` | VARCHAR | **Cifrado AES‑256‑GCM at‑rest** |
| `provider` | VARCHAR | Enum `FORM`, `GOOGLE`, `FACEBOOK` |
| `provider_id` | VARCHAR | Sub/ID del proveedor OAuth2 |
| `beta_tester` | BOOLEAN | Acceso a expansiones exclusivas |
| `admin` | BOOLEAN | Rol administrador (`ROLE_ADMIN`) |

Relación `OneToMany` con `buys`.

### `extensions`
PK: `id` (auto). Campos no traducibles: `price` (DECIMAL), `required_age`, `publication_date`, `image` (URL Cloudinary), `is_public` (si `false` → exclusiva beta). `OneToMany` con `extension_translations` y `buys`.

### `extension_translations`
Una fila por `(extension_id, language)` (unique constraint). Campos: `name`, `about_game` (TEXT), `category`, `platforms`, `languages`, `distributor`. Permite agregar idiomas sin alterar el esquema.

### `buys`
PK: `id`. `date`, `payment_method`, `language`, `platform`. FK `user_email → users(email)`, `extension_id → extensions(id)`.

### `cart_items`
PK: `id`. FK `user_email`, `extension_id`. `language`, `platform`, `added_date`.

### `site_content`
CMS de textos de UI. Unique `(section_key, content_key, language)`. Campos: `section_key`, `content_key`, `content_value` (TEXT), `content_type` (`text`|`html`|`json`), `language`. `created_at`/`updated_at` (vía `@PrePersist`/`@PreUpdate`).

### `site_config`
Configuraciones estructuradas (JSON como string). `config_key` único, `config_value` (TEXT). Ejemplo: `countries` → array de países con `code` y `name`.

### Diagrama relacional

```
users (email PK)
 ├──< buys (id) >── extensions (id)
 │                                  │
 │                                  └──< extension_translations (id, language)
 │
 └──< cart_items (id) >── extensions

site_content (section_key, content_key, language)   ← CMS de UI
site_config (config_key)                              ← configs (countries, ...)
```

---

## Backend

### Estructura del backend

```
src/main/java/com/nodo/retotecnico/
├── RetoTecnicoApplication.java       # Bootstrap
├── controllers/                      # REST (Auth, Users, Extensions, Buys, Cart, SiteContent, SiteConfig, Admin)
├── dto/                              # DTOs request/response + AuthResponse, UserResponseDTO, ExtensionResponseDTO...
├── models/                           # Entidades JPA (Users, Extensions, ExtensionTranslation, Buys, CartItem, SiteContent, SiteConfig, AuthProvider)
├── repositories/                     # Spring Data JPA
├── services/                         # Interfaces de servicios
├── serviceImpl/                      # Implementaciones (+ EmailService con Resend)
└── security/
    ├── config/                       # SecurityConfig, FilterRegistrationConfig
    ├── handlers/                     # Json error handlers (entry point, access denied, OAuth2 failure)
    ├── JwtUtils.java                 # Generación/validación de JWT (HS256, claim "type")
    ├── JwtAuthFilter.java            # Filtra el Bearer token y carga authorities
    ├── AuthRateLimitFilter.java      # Rate limit por IP en /api/auth/*
    ├── TokenRevocationService.java   # Lista negra in‑memory para logout
    ├── EncryptionUtils.java          # AES‑256‑GCM (encrypt/decrypt)
    ├── EncryptionRequestFilter.java  # Descifra X-Encrypted-Payload → body
    ├── EncryptionResponseFilter.java # Cifra response si X-Encrypted
    ├── EncryptionAttributeConverter.java  # Cifrado at‑rest de columnas sensibles
    ├── OAuth2UserServiceImpl.java    # Crea/actualiza usuario tras login social
    └── OAuth2SuccessHandler.java     # Genera JWT y redirige a FRONTEND_URL/oauth2/callback
```

### Seguridad del backend

Cadena de filtros (en orden relevante):

1. **`AuthRateLimitFilter`** (Order `-1`) — rate limit por IP (`X-Forwarded-For` o remote addr), in‑memory:

| Endpoint | Límite | Ventana |
|---|---|---|
| `POST /api/auth/login` | 5 intentos | 5 min |
| `POST /api/auth/register` | 3 intentos | 10 min |
| `POST /api/auth/beta/register` | 3 intentos | 10 min |
| `POST /api/auth/forgot-password` | 3 intentos | 10 min |

Excede → `429 Too Many Requests` en JSON. Habilitado por `rate-limit.enabled` (default `true`).

2. **`EncryptionRequestFilter`** — si llega el header `X-Encrypted-Payload`, descifra el body (AES‑256‑GCM) y lo deja como body del request para el controlador.

3. **`JwtAuthFilter`** (Order `2`) — se saltea rutas públicas (`/oauth2/*`, `/login/oauth2/*`, `/api/auth/*` salvo logout, `/error`). Para el resto:
   - Valida firma y expiración del JWT.
   - Verifica que el token no esté revocado (`TokenRevocationService`).
   - Si `type=BETA`, comprueba que el usuario exista y `betaTester=true` → `ROLE_BETA_TESTER`.
   - Si `type=USER`/sin tipo, carga desde `UserDetailsServiceImpl` (incluye `ROLE_ADMIN` si `admin=true`).
   - Sin token válido → `401` JSON.

4. **`EncryptionResponseFilter`** — si el cliente(envió `X-Encrypted: true`, cifra la respuesta en `X-Encrypted-Payload` con `Content-Type: application/octet-stream`.

**Política de rutas** (`SecurityConfig`):

- Públicos: `POST /api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `GET /api/auth/emails`, `/api/auth/beta/**`, `GET /api/extensions/**`, `GET /api/content/**`, `GET /api/config/**`, `/oauth2/**`, `/login/**`, `/error`.
- `GET /api/users` → `ROLE_ADMIN`.
- `/api/auth/logout`, `/api/cart/**`, `/api/buys/**` → autenticado.
- Escritura de `extensions`, `content`, `config` → autenticado.
- `/api/admin/**` → `@PreAuthorize("hasRole('ADMIN')")`.

**Ownership**: en carrito y compras, si el `email` del request no coincide con el email autenticado → `403 Forbidden`.

**JWT** (`JwtUtils`):
- Firma HMAC con clave Base64 (`jwt.secret`).
- Claims: `sub` = email, `type` ∈ `{USER, BETA, RESET}`, `iat`, `exp`.
- Expiración: 24 h (`jwt.expiration-ms`, default `86400000`); reset: 15 min.

### Cifrado AES‑256‑GCM

Se usa AES‑256‑GCM (`AES/GCM/NoPadding`) con dos propósitos distintos, ambos con la misma clave `ENCRYPTION_KEY` (Base64 32 bytes):

1. **En tránsito (extremo a extremo)** opcional, para endpoints sensibles:
   - **Request**: el cliente cifra el body y lo envía en el header `X-Encrypted-Payload` = `Base64(IV(12) || ciphertext || tag(16))`. El backend lo descifra y reconstruye el body.
   - **Response**: si el cliente envía `X-Encrypted: true`, el backend cifra la respuesta y la devuelve en `X-Encrypted-Payload` (con `Content-Type: application/octet-stream`).
   - Límite anti‑bomb: payload descifrado máximo 1 MB.
   - Endpoints con cifrado: `auth/register`, `auth/login`, `auth/logout`, `users/**`, `cart/**`, `buys/**`, `auth/forgot-password`, `auth/reset-password`.
   - Endpoints públicos (`extensions`, `content`, `config`) no soportan cifrado.

2. **At‑rest** para columnas sensibles de `users` (`identification`, `full_name`, `mobile_number`) vía `EncryptionAttributeConverter`. Los valores se cifran antes de persistir y se descifran al leer.

El frontend implementa el cifrado del lado cliente con la **Web Crypto API** (`src/shared/utils/crypto.js`) usando `VITE_ENCRYPTION_KEY`, que **debe coincidir** con `ENCRYPTION_KEY` del backend.

### Emails Resend

`EmailServiceImpl` usa el SDK `resend-java`. Carga plantillas HTML del classpath (`templates/email-*.html`) y reemplaza placeholders (`{{fullName}}`, `{{resetLink}}`, etc.). Tipos:

- `sendWelcomeEmail` (USER o BETA)
- `sendPasswordResetEmail` (link firmado)
- `sendPasswordChangedEmail`
- `sendPurchaseEmail` (lista de extensiones + total)
- `sendBroadcastEmail` (admin → beta testers; el body se sanitiza contra HTML injection)

### Endpoints del backend

Resumen por módulo (detalle completo en [`API_ENDPOINTS.md`](../reto-tecnico-nodo-nodo404/API_ENDPOINTS.md)):

| Módulo | Base | Públicos | Protegidos |
|---|---|---|---|
| Auth | `/api/auth` | `emails`, `register`, `login`, `forgot-password`, `reset-password`, `beta/**` | `logout` |
| OAuth2 | `/oauth2/authorization/{id}` y `/login/oauth2/code/{id}` | sí | — |
| Users | `/api/users` | `GET` (admin) | `GET /{email}`, `POST`, `PUT /{email}`, `DELETE /{email}` |
| Extensions | `/api/extensions` | GET `/`, `/{id}`, `/category/{c}`, `/distributor/{d}`, `/age/{a}`, `/trending`, `/random` | `POST`, `PUT`, `DELETE` |
| Content | `/api/content` | GET `/{sectionKey}`, `/{sectionKey}/{contentKey}` | `POST`, `PUT /{id}`, `DELETE /{id}` |
| Config | `/api/config` | GET `/{key}` | `POST`, `PUT /{id}`, `DELETE /{id}` |
| Cart | `/api/cart` | — | `GET /{email}`, `POST`, `DELETE /item/{id}`, `DELETE /clear/{email}` |
| Buys | `/api/buys` | — | `GET`, `GET /{id}`, `GET /user/{email}`, `POST`, `POST /direct`, `POST /checkout` |
| Admin | `/api/admin` | — | `GET /users/beta`, `GET /extensions/stats`, `POST /broadcast`, `POST /users/promote` |

### Configuración del backend

`src/main/resources/application.yaml` (placeholders `${VAR:default}`):

- `server.port: ${PORT:8080}` — Render inyecta `PORT`.
- `server.forward-headers-strategy: framework` — para que OAuth2 resuelva bien el `baseUrl` detrás del proxy de Vercel/Render.
- `spring.datasource.*` → PostgreSQL (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- `spring.jpa.hibernate.ddl-auto: update` — crea/actualiza el esquema.
- `spring.security.oauth2.client.registration` → `google`, `google-beta`, `facebook`, `facebook-beta` (con `client-authentication-method: client_secret_post` para Facebook). `redirect-uri` configurable por env (`OAUTH_GOOGLE_REDIRECT_URI`, `OAUTH_FACEBOOK_REDIRECT_URI`).
- `jwt.secret`, `jwt.expiration-ms`.
- `frontend.url` (`FRONTEND_URL`) — destino del redirect tras OAuth2.
- `resend.api-key`.
- `encryption.key`, `encryption.hmac-key`, `encryption.max-payload-size`.

Para desarrollo local, las vars se cargan opcionalmente desde `.env` (`spring.config.import: optional:file:.env[.properties]`).

---

## Frontend

### Estructura del frontend

```
src/
├── app/                              # Configuración de app
│   ├── App.jsx                       # Root: ContentProvider + MainLayout + CartDrawer
│   └── router.jsx                    # Rutas (lazy + Suspense)
├── features/                         # Folder Feature (lógica por dominio)
│   ├── auth/                         # components, hooks, pages, stores (Login/Register/OAuthCallback/Forgot/Reset)
│   ├── landing/                      # Hero, ExpansionGrid, ExpansionDetail, WelcomeModal, ExtensionsContext
│   ├── profile/                      # ProfilePage, useProfile
│   ├── cart/                         # CartDrawer
│   └── admin/                        # AdminPage
├── shared/
│   ├── components/                   # Header, Footer, Button, InputField, Checkbox, Skeleton, Alert,
│   │                                 # Logo, ThemeToggle, BetaTesterModal, MainLayout, SocialIcons
│   ├── context/                      # ContentContext + ContentProvider
│   ├── hooks/                        # useHeader, useTheme, useContent, useConfig
│   ├── services/                     # auth, users, extensions, content, cart, buys, admin, httpClient
│   ├── stores/                       # useAuthStore (sesión persist), useUsersStore (emails)
│   ├── utils/                        # errors (getFriendlyError), crypto (AES-GCM Web Crypto)
│   └── lang.js                       # Gestor de idioma (localStorage + evento custom)
├── data/                             # Datos mock/seed (expansionPacks.js, packMedia.js)
└── assets/                           # Imágenes estáticas
```

### Rutas

| Path | Componente | Acceso | Lazy |
|---|---|---|---|
| `/` | `LandingPage` | Público | No |
| `/registro` | `RegisterPage` | Público | Sí |
| `/expansion/:id` | `ExpansionDetailPage` | Público | No |
| `/login` | `LoginPage` | Público | Sí |
| `/oauth2/callback` | `OAuthCallback` | Público | Sí |
| `/perfil` | `ProfilePage` | Protegido (redirige a `/login` si no hay sesión) | Sí |
| `/forgot-password` | `ForgotPasswordPage` | Público | Sí |
| `/reset-password` | `ResetPasswordPage` | Público | Sí |
| `/admin` | `AdminPage` | Admin | Sí |

### Servicios API y httpClient

Todos los servicios (`src/shared/services/`) usan `httpClient.js`, que:

- Añade `Authorization: Bearer <JWT>` a las peticiones **no públicas**, leyendo el token desde `useAuthStore` (zustand persist).
- Marca como públicos (sin `Authorization` ni cifrado): `/api/extensions`, `/api/content`, `/api/config`, `/api/auth/emails`.
- Para endpoints **no públicos con body**, cifra el body con AES‑256‑GCM (`src/shared/utils/crypto.js`) y lo envía en `X-Encrypted-Payload` (y añade `X-Encrypted: true` para pedir respuesta cifrada).
- Descifra la respuesta si llega en `X-Encrypted-Payload`; si no, parsea JSON/text.

| Servicio | Archivo | Funciones |
|---|---|---|
| Auth | `auth.js` | `getRegisteredEmails`, `register`, `login`, `logout`, `forgotPassword`, `resetPassword` |
| Users | `users.js` | `getUsers`, `getUserByEmail`, `updateUser` |
| Extensions | `extensions.js` | `getExtensions`, `getExtensionById`, `getByCategory`, `getByDistributor`, `getByAge`, `getTrending`, `getRandom` |
| Content (CMS) | `content.js` | `getContentBySection`, `getContentByKey`, `createContent`, `updateContent`, `deleteContent` |
| Config (CMS) | `content.js` | `getConfig`, `createConfig`, `updateConfig`, `deleteConfig` |
| Cart | `cart.js` | get, add, removeItem, clear |
| Buys | `buys.js` | list, direct, checkout, byUser |
| Admin | `admin.js` | betaUsers, extensionStats, broadcast, promote |

Detalle de endpoints en [`endpoints.md`](./endpoints.md).

### State management zustand

| Store | Propósito |
|---|---|
| `useAuthStore` | Sesión. Persiste `token`, `email`, `user`, `profileComplete`, `isBetaTester` en `localStorage` (key `auth-storage`). `isLoggedIn` se **deriva** del token en la hidratación. Acciones: `setAuth`, `fetchUser`, `logout`, `setUser`. |
| `useUsersStore` | Lista de emails ya registrados (cargada una vez desde `GET /api/auth/emails`). `isEmailRegistered(email)` valida duplicados en memoria. `addEmail` tras registro exitoso. |
| `useLoginFormStore` / `useRegisterFormStore` | Estado de formularios (campos, errors, loading, success). Llaman a `useAuthStore.setAuth` tras login OK. |

### Flujo de autenticación

- **Por formulario** (`LoginPage` → `useLoginFormStore` → `login(email, password)`): el backend devuelve `{ token }`; el store llama a `setAuth(token, email)` y luego `fetchUser()` (`GET /api/users/{email}`) para poblar el perfil.
- **Por OAuth2** (`SocialButtons` → `/oauth2/authorization/{provider}`): el backend completa el flujo y `OAuth2SuccessHandler` redirige a `${FRONTEND_URL}/oauth2/callback?token=...&email=...`. `OAuthCallback.jsx` lee los query params y llama a `setAuth`.
- **Validación de email en registro**: `RegisterForm` dispara `useUsersStore.loadEmails()` y valida contra `isEmailRegistered(email)` en memoria. Tras un registro exitoso, `addEmail(email)` mantiene la caché sincronizada.

### Sistema de contenido dinámico (CMS)

**Regla de oro**: ningún texto visible para el usuario se hardcodea. Todo proviene de la BD vía `useContent()` / `useConfig()`.

- `ContentProvider` carga al iniciar todas las secciones (`getContentBySection`) y configs (`getConfig`) con `Promise.allSettled`. Si una sección falla, se conserva un fallback local.
- `useContent(sectionKey)` → `{ content, loading, error }` (textos editoriales: títulos, labels, placeholders, mensajes de validación, ARIA labels, mensajes de error).
- `useConfig(configKey)` → `{ config, loading, error }` (listas estructuradas, ej. `countries`).
- Secciones: `landing.hero`, `landing.grid`, `landing.welcome`, `auth.login`, `auth.register`, `auth.social`, `auth.oauth`, `header`, `beta_modal`, `footer`, `common`, `profile.page`, `theme.toggle`, `validation.login`, `validation.register`, `validation.profile`, `errors.common`, `placeholders`, `select.default`.

### Internacionalización

- El frontend usa `src/shared/lang.js` (sin dependencias): `lang.get()`, `lang.set('en')`, `lang.toggle()`, `lang.onChange(fn)`. Persiste en `localStorage` y emite un evento custom.
- Al cambiar el idioma, `ContentProvider` recarga `site_content` (los textos) y `ExtensionsContext` recarga las extensiones (con `?language=es|en`).
- **No se usa i18next ni archivos `locales/*.json`**: la BD es la única fuente de traducciones (ES/EN), tanto para textos de UI como para `extension_translations`.

### Manejo de errores amigables

`src/shared/utils/errors.js` → `getFriendlyError(messages, err)` mapea:
1. **Keywords** en el mensaje del backend → clave de `errors.common` (case‑insensitive).
2. **Código HTTP** en el string (`400`, `401`, ...).
3. **Errores de red** (`Failed to fetch`, `NetworkError`).
4. **Fallback**: si el mensaje es muy largo → `unexpected_error`; si no, devuelve el mensaje crudo.

Los hooks (`useLoginForm`, `useRegisterForm`, `useProfile`, `useHeader`) leen `errors.common` con `useContent` y lo pasan a `getFriendlyError`, permitiendo traducir los mensajes del backend sin tocar el `httpClient`.

### Tema claro/oscuro

`useTheme` controla el tema. Se persiste en `localStorage` y se aplica agregando/quitando la clase `dark` en `<html>`. `ThemeToggle` expone ARIA labels desde el CMS (`theme.toggle`).

---

## Despliegue

### Arquitectura de despliegue

```
Navegador ── https://nodo404.vercel.app ──► (rewrites en vercel.json, mismo origen)
                │  /api/*  /oauth2/authorization/*  /login/*
                ▼
      Spring Boot en Render (Docker, onrender.com)
                │  jdbc:postgresql (pooler Supabase, sslmode=require)
                ▼
        Supabase Postgres
```

- **Frontend → Vercel**: static build de Vite (`pnpm build` → `dist/`). `vercel.json` reescribe `/api/:path*`, `/oauth2/authorization/:path*` y `/login/:path*` hacia el backend, y manda todo lo demás a `/index.html` (SPA fallback). Así no hay CORS y el `httpClient` funciona sin cambios (URLs relativas `/api/...`).
- **Backend → Render**: web service Docker definido en `render.yaml` (blueprint). Build multi‑stage (`Dockerfile` con `eclipse-temurin:21`), health check en `/api/auth/emails`, autoDeploy. `server.forward-headers-strategy: framework` para que OAuth2 resuelva el `baseUrl` detrás del proxy.
- **Base de datos → Supabase**: conexión por el **pooler en modo session** (`aws-0-<region>.pooler.supabase.com:5432`) con `sslmode=require`, usuario `postgres.<project-ref>`.

Archivos de despliegue relevantes:

- `front-reto-tecnico-nodo404/vercel.json` — rewrites.
- `reto-tecnico-nodo-nodo404/Dockerfile` — build + runtime.
- `reto-tecnico-nodo-nodo404/render.yaml` — blueprint de Render.
- `reto-tecnico-nodo-nodo404/.dockerignore`.

### Variables de entorno

**Backend (Render / `.env` local)** — ver [`reto-tecnico-nodo-nodo404/.env.example`](../reto-tecnico-nodo-nodo404/.env.example):

| Variable | Descripción | Prod |
|---|---|---|
| `DB_URL` | JDBC de Supabase (pooler session) | `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DB_USERNAME` | Usuario del pooler | `postgres.<project-ref>` |
| `DB_PASSWORD` | Password de BD | (de Supabase) |
| `JWT_SECRET` | Clave HMAC del JWT (Base64) | aleatorio 32 bytes |
| `JWT_EXPIRATION_MS` | Expiración del JWT | `86400000` (24 h) |
| `ENCRYPTION_KEY` | Clave AES‑256‑GCM (Base64 32 bytes) — **debe coincidir con `VITE_ENCRYPTION_KEY`** | aleatorio |
| `HMAC_KEY` | Clave HMAC adicional | aleatorio |
| `RESEND_API_KEY` | API key de Resend | (de Resend) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth2 Google | (de Google Cloud) |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | OAuth2 Facebook | (de Meta) |
| `FRONTEND_URL` | URL del frontend (para redirect OAuth2) | `https://nodo404.vercel.app` |
| `OAUTH_GOOGLE_REDIRECT_URI` | redirect_uri de Google | `https://nodo404.vercel.app/login/oauth2/code/google` |
| `OAUTH_FACEBOOK_REDIRECT_URI` | redirect_uri de Facebook | `https://nodo404.vercel.app/login/oauth2/code/facebook` |

**Frontend (Vercel / `.env` local)** — ver [`.env.example`](./.env.example):

| Variable | Descripción |
|---|---|
| `VITE_ENCRYPTION_KEY` | Clave AES‑256‑GCM del cliente (debe coincidir con `ENCRYPTION_KEY` del backend) |

> Nota: el proxy de Vite (`vite.config.js`) reenvía `/api`, `/oauth2/authorization` y `/login/oauth2/code` a `http://localhost:8080` en desarrollo.

### OAuth2 en producción

Con las rewrites de Vercel, el navegador termina siempre en el dominio de Vercel, por eso las **redirect URIs** registradas en los proveedores usan el dominio de Vercel:

- **Google Cloud Console** (OAuth client → Authorized redirect URIs): `https://nodo404.vercel.app/login/oauth2/code/google`
- **Meta for Developers**:
  - *Dominios de la app*: `nodo404.vercel.app`
  - *URL del sitio*: `https://nodo404.vercel.app/`
  - *Valid OAuth Redirect URIs*: `https://nodo404.vercel.app/login/oauth2/code/facebook`

Para **Facebook**, el backend usa `client-authentication-method: client_secret_post` (Facebook no acepta Basic Auth en el token endpoint).

---

## Puesta en marcha local

### Backend

```bash
cd reto-tecnico-nodo-nodo404
cp .env.example .env     # rellenar DB_URL, JWT_SECRET, ENCRYPTION_KEY, HMAC_KEY, etc.
# Windows
mvnw.cmd spring-boot:run
# Linux/macOS
bash mvnw spring-boot:run
```

Requisitos: Java 21+ y PostgreSQL (`localhost:5432/reto-tecnico` por defecto, user `postgres`, pass `admin`).

### Frontend

```bash
cd front-reto-tecnico-nodo404
pnpm install
cp .env.example .env     # VITE_ENCRYPTION_KEY (igual que ENCRYPTION_KEY del backend)
pnpm dev
```

El frontend levanta en `http://localhost:5173` y el proxy de Vite enruta las llamadas `/api`, `/oauth2/authorization` y `/login/oauth2/code` al backend en `http://localhost:8080`.

---

## Semilla de datos

- `init.sql` — esquema SQL alternativo (creación manual de tablas).
- `data.sql` — seed de extensiones, traducciones ES/EN, `site_content` (todos los textos de UI) y `site_config` (`countries`).

> ⚠️ **`data.sql` es destructivo** (comienza con `DELETE FROM extension_translations; DELETE FROM extensions; DELETE FROM buys; DELETE FROM cart_items;` y `DELETE FROM site_content;`/`DELETE FROM site_config;`). **No se ejecuta automáticamente en producción**: con `ddl-auto: update`, Hibernate crea el esquema en el primer arranque; luego `data.sql` se ejecuta **una sola vez** a mano en el SQL Editor de Supabase (o en la BD local) para poblar los datos iniciales.

---

## Pruebas

```bash
# Backend
mvnw.cmd test        # Windows
bash mvnw test       # Linux/macOS
```

El backend usa H2 para los tests y Spring Modulith para pruebas de módulos.

Frontend:

```bash
pnpm lint            # oxlint
pnpm build           # build de producción
```

---

## Convenciones y decisiones técnicas

### Frontend

- **Mobile First**: CSS base para mobile, `@media (min-width: ...)` para desktop.
- **BEM**: solo cuando no se usa Tailwind.
- **Folder Feature**: agrupar por dominio (`features/auth/`, `features/landing/`, etc.) y desacoplar lógica en `hooks/`.
- **User Feedback obligatorio**: loading, empty, error states y transiciones en toda interacción.
- **Contenido dinámico**: TODO texto visible pasa por `useContent()` / `useConfig()` (incluidos ARIA labels y mensajes de validación/error).
- **Componentes reutilizables**: nunca redefinir estilos que ya existen en el componente; solo agregar clases de layout.
- **Sin comentarios ni emojis** salvo petición explícita.
- **Sesión**: el token vive solo en `useAuthStore` (persist); el `httpClient` lo lee vía `useAuthStore.getState().token`. No hay escrituras manuales a `localStorage` ni un key `token` suelto.

### Backend

- **Spring Modulith** para organización modular.
- **Lombok** para DTOs/entidades.
- **DTOs** para request/response (`RegisterRequest`, `LoginRequest`, `AuthResponse`, `UserResponseDTO`, `ExtensionResponseDTO`, etc.), desacoplando la API de las entidades.
- **Rate limiting in‑memory** (aceptable para el reto; se reinicia al redeployar).
- **Revocación de tokens in‑memory** (lista negra con expiración natural).
- **Cifrado at‑rest** de PII (`identification`, `full_name`, `mobile_number`) además del cifrado en tránsito.
- **OAuth2 nativo** de Spring Security (Google + Facebook, con variants `-beta` para emitir JWT `type=BETA`).

### Seguridad

- BCrypt para contraseñas.
- JWT con expiración y claim `type`; reset con 15 min de vida.
- Ownership por email en carrito y compras (`403` si no coincide).
- Roles: `USER`, `BETA_TESTER`, `ADMIN` (method security con `@PreAuthorize`).
- Rate limiting en auth; forgot‑password no revela qué correos existen.
- Cifrado E2E opcional AES‑256‑GCM para endpoints sensibles.

### Git

- Ramas: `feature/`, `fix/`, `refactor/`, `chore/`.
- Commits atómicos y Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- PRs pequeños y enfocados. No se commitean secrets (`.env` en `.gitignore`).

---

## Repositorios

- Frontend: `https://github.com/mateoPosada82231/front-reto-tecnico-nodo404`
- Backend: `https://github.com/mateoPosada82231/reto-tecnico-nodo-nodo404`

## Licencia

Proyecto de carácter académico / técnico (Reto Técnico Nodo).
