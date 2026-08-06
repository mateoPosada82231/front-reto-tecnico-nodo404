# API Endpoints - Reto Técnico Nodo

Referencia actualizada de rutas HTTP, seguridad y payloads principales.

## Base URL y headers

- Base URL local: `http://localhost:8080`
- Header para rutas protegidas:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## Cifrado end-to-end (AES-256-GCM)

Los endpoints marcados como **sensibles** soportan cifrado opcional del payload en tránsito.

### Request cifrado (cliente → servidor)

El cliente envía el body cifrado en el header en lugar del body HTTP:

| Header                | Valor                                     | Obligatorio                        |
| --------------------- | ----------------------------------------- | ---------------------------------- |
| `X-Encrypted-Payload` | `base64(IV(12 bytes) + ciphertext + tag)` | Solo si se desea cifrar            |
| `X-Encrypted`         | `true`                                    | Solo si se desea respuesta cifrada |

Si no se envía `X-Encrypted-Payload`, el servidor procesa el body como plain-text (fallback).

Formato del payload cifrado: `Base64(IV(12 bytes) || ciphertext || GCM tag(16 bytes))`

### Response cifrado (servidor → cliente)

Si el cliente envía `X-Encrypted: true`, el servidor responde con:

| Header                | Valor                                     |
| --------------------- | ----------------------------------------- |
| `X-Encrypted-Payload` | `base64(IV(12 bytes) + ciphertext + tag)` |
| `Content-Type`        | `application/octet-stream`                |

Si no se envía `X-Encrypted`, la respuesta es plain-text normal.

### Endpoints con cifrado disponible

| Endpoint                            | Cifrado request | Cifrado response          |
| ----------------------------------- | --------------- | ------------------------- |
| `POST /api/auth/register`           | ✅ Opcional     | ✅ Si `X-Encrypted: true` |
| `POST /api/auth/login`              | ✅ Opcional     | ✅ Si `X-Encrypted: true` |
| `POST /api/auth/logout`             | ❌              | ✅ Si `X-Encrypted: true` |
| `GET/POST/PUT/DELETE /api/users/**` | ✅ Opcional     | ✅ Si `X-Encrypted: true` |
| `GET/POST/DELETE /api/cart/**`      | ✅ Opcional     | ✅ Si `X-Encrypted: true` |
| `GET/POST /api/buys/**`             | ✅ Opcional     | ✅ Si `X-Encrypted: true` |

Los endpoints públicos (`/api/extensions`, `/api/content`, `/api/config`) **no** soportan cifrado.

### Algoritmo

- **Cifrado**: AES-256-GCM (AES/GCM/NoPadding)
- **IV**: 12 bytes aleatorios por operación
- **Tag**: 128 bits (16 bytes)
- **Clave**: 32 bytes (256 bits), precompartida vía variable de entorno
- **Límite**: Payload descifrado máximo 1MB (anti-bomb)

### Ejemplo de integración (Web Crypto API)

```javascript
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY; // Base64 32 bytes

async function encrypt(plaintext) {
  const keyData = Uint8Array.from(atob(ENCRYPTION_KEY), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}
```

### Configuración de clave

```
# .env (frontend y backend deben usar la misma clave)
ENCRYPTION_KEY=R4VhZzxNzz9gTs3CJ23LH0ZpCvCm74EScFsvgvtMOss=
```

## Seguridad global

### Endpoints públicos

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/emails`
- `POST /api/auth/beta/**`
- `GET /api/extensions/**`
- `GET /api/content/**`
- `GET /api/config/**`
- `GET /oauth2/authorization/google`
- `GET /oauth2/authorization/facebook`
- `GET /login/oauth2/code/{registrationId}`
- `GET /error`

### Endpoints protegidos

- `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/users/**`
- `POST/PUT/DELETE /api/extensions/**`
- `POST/PUT/DELETE /api/content/**`
- `POST/PUT/DELETE /api/config/**`
- `GET/POST/DELETE /api/cart/**`
- `GET/POST /api/buys/**`
- Cualquier otra ruta no pública

### Reglas de ownership (carrito y compras)

Si el email del request no coincide con el email autenticado:

- Respuesta: `403 Forbidden`

Sin autenticación válida:

- Respuesta: `401 Unauthorized`

### Formato de error de seguridad (401/403)

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/cart/user@nodo.com",
  "timestamp": "2026-03-24T16:00:00Z"
}
```

---

## 1) Auth - `/api/auth`

### GET `/api/auth/emails`

Devuelve la lista de todos los emails ya registrados (público, sin cifrado). Pensado para validación de duplicados en el cliente (store de Zustand) sin tocar la BD por cada intento de registro.

Respuesta `200 OK`:

```json
["user1@nodo.com", "user2@nodo.com"]
```

### POST `/api/auth/register`

Crea usuario local (`provider=FORM`, `betaTester=false`). Soporta cifrado end-to-end (ver § Cifrado).

Body:

```json
{
  "email": "user@nodo.com",
  "password": "Secret123!",
  "country": "CO",
  "identification": "123456789",
  "fullName": "Usuario Demo",
  "mobileNumber": "3001234567",
  "dateOfBirth": "1998-10-20"
}
```

Respuestas comunes:

- `200 OK`: `"Usuario creado con éxito"`
- `400 Bad Request`:

```json
{
  "message": "El email ya está registrado"
}
```

### POST `/api/auth/login`

Autentica con email/password y retorna JWT con `type=USER`. Soporta cifrado end-to-end (ver § Cifrado).

Body:

```json
{
  "email": "user@nodo.com",
  "password": "Secret123!"
}
```

Respuestas comunes:

- `200 OK`:

```json
{
  "token": "<JWT>"
}
```

- `401 Unauthorized`:

```json
{
  "message": "Credenciales inválidas"
}
```

### POST `/api/auth/logout`

Revoca el token enviado.

Respuestas comunes:

- `200 OK`:

```json
{
  "message": "Sesion cerrada con exito"
}
```

- `401 Unauthorized`:

```json
{
  "message": "Token ausente o con formato inválido"
}
```

ó

```json
{
  "message": "Token inválido o expirado"
}
```

### POST `/api/auth/beta/register`

Crea usuario beta tester (`provider=FORM`, `betaTester=true`).

Body: mismo formato que `/api/auth/register`.

Respuestas comunes:

- `200 OK`: `"Beta tester creado con éxito"`
- `400 Bad Request`: `"El email ya está registrado"`

### POST `/api/auth/beta/login`

Autentica un beta tester y retorna JWT con `type=BETA`. Solo acepta usuarios con `betaTester=true`.

Body: mismo formato que `/api/auth/login`.

Respuestas comunes:

- `200 OK`:

```json
{
  "token": "<JWT>"
}
```

- `401 Unauthorized`:

```json
{
  "message": "Credenciales inválidas"
}
```

---

## 2) OAuth2

### GET `/oauth2/authorization/google`

Inicia autenticación OAuth2 con Google (crea usuario normal).

### GET `/oauth2/authorization/google-beta`

Inicia autenticación OAuth2 con Google (crea usuario beta tester).

### GET `/oauth2/authorization/facebook`

Inicia autenticación OAuth2 con Facebook (crea usuario normal).

### GET `/oauth2/authorization/facebook-beta`

Inicia autenticación OAuth2 con Facebook (crea usuario beta tester).

### GET `/login/oauth2/code/{registrationId}`

Callback OAuth2; en éxito retorna JWT. El `type` del JWT (`USER` o `BETA`) se determina por el registrationId (si termina en `-beta`).

---

## 3) Users - `/api/users` (todas protegidas)

### GET `/api/users`

Lista usuarios (incluye campo `betaTester`).

### GET `/api/users/{email}`

Consulta usuario por email. Retorna `UserResponseDTO`:

```json
{
  "email": "user@nodo.com",
  "fullName": "Usuario Demo",
  "provider": "FORM",
  "providerId": null,
  "country": "CO",
  "identification": "123456789",
  "mobileNumber": "3001234567",
  "dateOfBirth": "1998-10-20",
  "profileComplete": true,
  "betaTester": false
}
```

### POST `/api/users`

Crea usuario.

### PUT `/api/users/{email}`

Actualiza usuario por email.

### DELETE `/api/users/{email}`

Elimina usuario por email.

Respuestas comunes:

- `200 OK`, `201 Created`, `204 No Content`
- `404 Not Found` para recursos inexistentes
- `401 Unauthorized` sin token o con token inválido

---

## 4) Extensions - `/api/extensions`

Las extensiones exponen sus textos localizables (name, aboutGame, category, platforms, languages, distributor) a través de la subtabla `extension_translations`. Todos los endpoints GET aceptan el query param `?language=es|en` (por defecto `es`); si falta la traducción en el idioma solicitado, se aplica **fallback a ES**.

### Públicas (GET)

- `GET /api/extensions?language=es|en`
- `GET /api/extensions/{id}?language=es|en`
- `GET /api/extensions/category/{category}?language=es|en`
- `GET /api/extensions/distributor/{distributor}?language=es|en`
- `GET /api/extensions/age/{age}?language=es|en`
- `GET /api/extensions/trending?language=es|en`
- `GET /api/extensions/random?language=es|en`

### Protegidas (escritura)

- `POST /api/extensions`
- `PUT /api/extensions/{id}`
- `DELETE /api/extensions/{id}`

Respuesta para `DELETE /api/extensions/{id}`:

```json
{
  "message": "Extension eliminada con exito"
}
```

Body ejemplo para crear/actualizar (los campos traducibles van dentro de `translations`, una entrada por `language`):

```json
{
  "price": 19.99,
  "requiredAge": 16,
  "publicationDate": "2026-01-10",
  "image": "https://.../expansion.png",
  "translations": [
    {
      "language": "es",
      "name": "Expansion Pack",
      "aboutGame": "Contenido adicional",
      "platforms": "PC",
      "languages": "ES,EN",
      "distributor": "Nodo Games",
      "category": "Accion"
    },
    {
      "language": "en",
      "name": "Expansion Pack",
      "aboutGame": "Additional content",
      "platforms": "PC",
      "languages": "ES,EN",
      "distributor": "Nodo Games",
      "category": "Action"
    }
  ]
}
```

Respuesta de lectura (GET), DTO ya en el idioma solicitado:

```json
{
  "id": 1,
  "name": "Expansion Pack",
  "aboutGame": "Contenido adicional",
  "category": "Accion",
  "platforms": "PC",
  "languages": "ES,EN",
  "distributor": "Nodo Games",
  "price": 19.99,
  "requiredAge": 16,
  "publicationDate": "2026-01-10",
  "image": "https://.../expansion.png",
  "language": "es"
}
```

Respuestas comunes:

- `200 OK`, `201 Created`
- `404 Not Found`
- `401 Unauthorized` para endpoints protegidos

---

## 5) Site Content - `/api/content`

Gestión de textos de UI (CMS ligero). Los endpoints de lectura son públicos y incluyen cache de 5 minutos.

### Públicas (GET)

#### GET `/api/content/{sectionKey}`

Obtiene todos los items de una sección.

Query param opcional: `language` (default: `es`)

Respuesta `200 OK`:

```json
{
  "section": "auth.login",
  "items": [
    { "key": "title", "value": "Iniciar Sesión", "type": "text" },
    { "key": "subtitle", "value": "Accede con tu cuenta...", "type": "text" }
  ]
}
```

Si la sección no existe retorna items vacío: `{ "section": "...", "items": [] }`

#### GET `/api/content/{sectionKey}/{contentKey}`

Obtiene un valor específico de contenido.

Query param opcional: `language` (default: `es`)

Respuesta `200 OK`:

```json
{
  "key": "title",
  "value": "Iniciar Sesión",
  "type": "text"
}
```

Respuesta `404 Not Found` si no existe.

### Protegidas (escritura, requiere JWT)

#### POST `/api/content`

Crea contenido.

Body:

```json
{
  "sectionKey": "auth.login",
  "contentKey": "title",
  "contentValue": "Iniciar Sesión",
  "contentType": "text",
  "language": "es"
}
```

- `sectionKey` y `contentKey`: alfanuméricos con puntos y guiones bajos (`^[a-z0-9_.]+$`)
- `contentType`: `text` (default), `html`, o `json`
- `language`: código de idioma (default: `es`)

Respuestas:

- `201 Created`: objeto creado
- `409 Conflict`: ya existe contenido con misma sección + clave + idioma
- `400 Bad Request`: validación fallida

#### PUT `/api/content/{id}`

Actualiza contenido por ID.

Body: mismo formato que POST.

- `200 OK`: objeto actualizado
- `404 Not Found`: ID inexistente

#### DELETE `/api/content/{id}`

Elimina contenido por ID.

- `200 OK`:

```json
{
  "message": "Content deleted successfully"
}
```

- `404 Not Found`:

```json
{
  "message": "Content not found"
}
```

### Secciones de contenido disponibles

| Sección           | Items | Descripción                        |
| ----------------- | ----- | ---------------------------------- |
| `landing.hero`    | 5     | Textos del carrusel hero           |
| `landing.grid`    | 3     | Título y CTAs de la grilla         |
| `landing.welcome` | 4     | Modal de bienvenida                |
| `auth.login`      | 7     | Formulario de login                |
| `auth.register`   | 14    | Formulario de registro             |
| `auth.social`     | 2     | Textos divider de botones sociales |
| `auth.oauth`      | 1     | Texto de loading OAuth             |
| `header`          | 6     | Navegación y banner                |
| `beta_modal`      | 9     | Modal de beta tester               |
| `footer`          | 1     | Copyright                          |
| `common`          | 1     | Textos compartidos                 |

---

## 6) Site Config - `/api/config`

Gestión de configuraciones estructuradas (JSON). Los endpoints de lectura son públicos y incluyen cache de 5 minutos.

### Pública (GET)

#### GET `/api/config/{configKey}`

Obtiene configuración por clave.

Respuesta `200 OK`:

```json
{
  "key": "countries",
  "value": [
    { "code": "CO", "name": "Colombia" },
    { "code": "MX", "name": "México" }
  ]
}
```

Respuesta `404 Not Found` si no existe.

### Protegidas (escritura, requiere JWT)

#### POST `/api/config`

Crea configuración.

Body:

```json
{
  "configKey": "countries",
  "configValue": "[{\"code\":\"CO\",\"name\":\"Colombia\"}]"
}
```

- `configKey`: nombre único de la configuración
- `configValue`: string con JSON válido

Respuestas:

- `201 Created`: objeto creado
- `409 Conflict`: ya existe una configuración con esa clave
- `400 Bad Request`: validación fallida

#### PUT `/api/config/{id}`

Actualiza configuración por ID.

Body: mismo formato que POST.

- `200 OK`: objeto actualizado
- `404 Not Found`: ID inexistente

#### DELETE `/api/config/{id}`

Elimina configuración por ID.

- `200 OK`:

```json
{
  "message": "Config deleted successfully"
}
```

- `404 Not Found`:

```json
{
  "message": "Config not found"
}
```

### Configuraciones disponibles

| Clave       | Descripción                           |
| ----------- | ------------------------------------- |
| `countries` | Array de 8 países con código y nombre |

---

## 7) Cart - `/api/cart` (todas protegidas + ownership)

### GET `/api/cart/{email}?language=es|en`

Retorna resumen del carrito (las extensiones vienen traducidas según `language`; default `es`).

Respuesta ejemplo:

```json
{
  "items": [
    {
      "id": 1,
      "addedDate": "2026-08-05",
      "language": "ES",
      "platform": "PC",
      "userEmail": "user@nodo.com",
      "extension": {
        "id": 1,
        "name": "Aventura en el Desierto",
        "aboutGame": "...",
        "category": "...",
        "platforms": "...",
        "languages": "...",
        "distributor": "...",
        "price": 49.99,
        "requiredAge": 12,
        "publicationDate": "2025-06-20",
        "image": "...",
        "language": "es"
      }
    }
  ],
  "itemsCount": 1,
  "totalPrice": 49.99
}
```

### POST `/api/cart`

Agrega item al carrito.

Body:

```json
{
  "email": "user@nodo.com",
  "extensionId": 1,
  "language": "ES",
  "platform": "PC"
}
```

Errores de negocio (`400 Bad Request`):

- `Los campos language y platform son obligatorios`
- `Usuario no encontrado`
- `Producto no encontrado`
- `El producto ya está en el carrito`

### DELETE `/api/cart/item/{cartItemId}?email={email}`

Elimina item puntual.

- `200 OK`: `"Producto eliminado del carrito"`

### DELETE `/api/cart/clear/{email}`

Limpia carrito completo.

- `200 OK`: `"Carrito limpiado correctamente"`

Respuestas comunes del módulo:

- `200 OK`
- `401 Unauthorized`
- `403 Forbidden`
- `400 Bad Request` (validaciones de negocio)

---

## 8) Buys - `/api/buys` (todas protegidas)

### GET `/api/buys`

Lista compras.

### GET `/api/buys/{id}`

Consulta compra por id.

### GET `/api/buys/user/{email}?language=es|en`

Lista compras del usuario autenticado (las extensiones vienen traducidas según `language`; default `es`).

Respuesta ejemplo:

```json
[
  {
    "id": 1,
    "date": "2026-08-05",
    "paymentMethod": "CARD",
    "language": "ES",
    "platform": "PC",
    "userEmail": "user@nodo.com",
    "extension": {
      "id": 1,
      "name": "Aventura en el Desierto",
      "price": 49.99,
      "image": "...",
      "language": "es"
    },
    "extensionPrice": 49.99
  }
]
```

- Si el `email` no coincide con el usuario del token: `403 Forbidden`

### POST `/api/buys`

Crea compra básica (sin language/platform).

Body:

```json
{
  "userEmail": "user@nodo.com",
  "extensionId": 1,
  "paymentMethod": "CARD"
}
```

### POST `/api/buys/direct`

Compra directa (requiere `language` y `platform`).

Body:

```json
{
  "email": "user@nodo.com",
  "extensionId": 1,
  "paymentMethod": "CARD",
  "language": "ES",
  "platform": "PC"
}
```

Respuesta `201 Created` ejemplo:

```json
{
  "buy": {
    "id": 101,
    "paymentMethod": "CARD",
    "language": "ES",
    "platform": "PC"
  },
  "totalPrice": 19.99,
  "message": "Compra directa realizada con éxito"
}
```

Error de validación:

- `400 Bad Request`: `"language y platform son obligatorios"`

### POST `/api/buys/checkout`

Convierte el carrito completo en compras y luego limpia el carrito.

Body:

```json
{
  "userEmail": "user@nodo.com",
  "paymentMethod": "CARD"
}
```

Respuesta `200 OK` ejemplo:

```json
{
  "buys": [],
  "itemsCount": 2,
  "totalPrice": 34.49,
  "message": "Compra realizada con éxito y carrito vaciado."
}
```

Error de negocio posible:

- `RuntimeException`: `"El carrito está vacío, no hay nada que comprar."`

Respuestas comunes del módulo:

- `200 OK`, `201 Created`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found` (consulta por id inexistente)

---

---

## 9) Rate Limiting

Protección contra abuso en endpoints de autenticación, configurable via `rate-limit.enabled` en `application.yaml`.

| Endpoint                       | Límite     | Ventana    | Excede                  |
| ------------------------------ | ---------- | ---------- | ----------------------- |
| `POST /api/auth/login`         | 5 intentos | 5 minutos  | `429 Too Many Requests` |
| `POST /api/auth/register`      | 3 intentos | 10 minutos | `429 Too Many Requests` |
| `POST /api/auth/beta/register` | 3 intentos | 10 minutos | `429 Too Many Requests` |

La ventana se mide por IP del cliente (`X-Forwarded-For` o remote address).

Se puede deshabilitar completamente con `rate-limit.enabled: false`.

Respuesta `429 Too Many Requests`:

```json
{
  "status": 429,
  "error": "Demasiadas solicitudes",
  "message": "Demasiados intentos de login. Intenta de nuevo en 5 minutos."
}
```

---

## Resumen rápido

### Públicos

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/emails`
- `POST /api/auth/beta/register`
- `POST /api/auth/beta/login`
- `GET /api/extensions/**`
- `GET /api/content/**`
- `GET /api/config/**`
- `GET /oauth2/authorization/{provider}`
- `GET /login/oauth2/code/{registrationId}`

### Protegidos

- `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/users/**`
- `POST/PUT/DELETE /api/extensions/**`
- `POST/PUT/DELETE /api/content/**`
- `POST/PUT/DELETE /api/config/**`
- `GET/POST/DELETE /api/cart/**`
- `GET/POST /api/buys/**`
