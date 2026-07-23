# API Endpoints - Reto Técnico Nodo

Referencia actualizada de rutas HTTP, seguridad y payloads principales.

## Base URL y headers

- Base URL local: `http://localhost:8080`
- Header para rutas protegidas:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## Seguridad global

### Endpoints públicos

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/beta/**`
- `GET /api/beta-testers/**`
- `GET /api/extensions/**`
- `GET /oauth2/authorization/google`
- `GET /oauth2/authorization/facebook`
- `GET /login/oauth2/code/{registrationId}`
- `GET /error`

### Endpoints protegidos

- `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/users/**`
- `POST/PUT/DELETE /api/extensions/**`
- `GET/POST/DELETE /api/cart/**`
- `GET/POST /api/buys/**`
- `POST/PUT/DELETE /api/beta-testers/**`
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

### POST `/api/auth/register`

Crea usuario local (`provider=FORM`).

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
- `400 Bad Request`: `"El email ya está registrado"`

### POST `/api/auth/login`

Autentica con email/password y retorna JWT.

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

---

## 2) OAuth2

### GET `/oauth2/authorization/google`

Inicia autenticación OAuth2 con Google.

### GET `/oauth2/authorization/facebook`

Inicia autenticación OAuth2 con Facebook.

### GET `/login/oauth2/code/{registrationId}`

Callback OAuth2; en éxito retorna JWT.

---

## 3) Users - `/api/users` (todas protegidas)

### GET `/api/users`

Lista usuarios.

### GET `/api/users/{email}`

Consulta usuario por email.

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

## 4) Beta Testers - `/api/beta-testers`

### Públicas (GET)

- `GET /api/beta-testers`
- `GET /api/beta-testers/{email}`

### Protegidas (escritura)

- `POST /api/beta-testers`
- `PUT /api/beta-testers/{email}`
- `DELETE /api/beta-testers/{email}`

### GET `/api/beta-testers`

Lista todos los beta testers registrados.

```json
[
  {
    "email": "beta@nodo.com",
    "country": "CO",
    "dateOfBirth": "1995-06-15",
    "identification": "1234567890",
    "fullName": "Beta Tester",
    "mobileNumber": "3001234567",
    "dateOfAdmission": "2026-07-23",
    "provider": "FORM",
    "providerId": null
  }
]
```

### GET `/api/beta-testers/{email}`

Consulta un beta tester por email.

- `200 OK`: beta tester encontrado
- `404 Not Found`: email inexistente

### POST `/api/beta-testers`

Registra un nuevo beta tester. La contraseña se encripta automáticamente. `dateOfAdmission` se asigna con la fecha actual.

Body:

```json
{
  "email": "beta@nodo.com",
  "password": "Secret123!",
  "country": "CO",
  "dateOfBirth": "1995-06-15",
  "identification": "1234567890",
  "fullName": "Beta Tester",
  "mobileNumber": "3001234567"
}
```

Respuesta `201 Created`: beta tester creado (sin contraseña en claro).

### PUT `/api/beta-testers/{email}`

Actualiza un beta tester existente. La contraseña se re-encripta.

Body: mismo formato que POST.

- `200 OK`: beta tester actualizado
- `404 Not Found`: email inexistente

### DELETE `/api/beta-testers/{email}`

Elimina un beta tester por email.

- `204 No Content`: eliminado correctamente
- `404 Not Found`: email inexistente

Respuestas comunes del módulo:

- `200 OK`, `201 Created`, `204 No Content`
- `401 Unauthorized` sin token o con token inválido
- `404 Not Found` para recursos inexistentes

---

## 5) Extensions - `/api/extensions`

### Públicas (GET)

- `GET /api/extensions`
- `GET /api/extensions/{id}`
- `GET /api/extensions/category/{category}`
- `GET /api/extensions/distributor/{distributor}`
- `GET /api/extensions/age/{age}`
- `GET /api/extensions/trending`
- `GET /api/extensions/random`

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

Body ejemplo para crear/actualizar:

```json
{
  "price": 19.99,
  "requiredAge": 16,
  "name": "Expansion Pack",
  "aboutGame": "Contenido adicional",
  "platforms": "PC",
  "languages": "ES,EN",
  "distributor": "Nodo Games",
  "publicationDate": "2026-01-10",
  "category": "Accion"
}
```

Respuestas comunes:

- `200 OK`, `201 Created`
- `404 Not Found`
- `401 Unauthorized` para endpoints protegidos

---

## 6) Cart - `/api/cart` (todas protegidas + ownership)

### GET `/api/cart/{email}`

Retorna resumen del carrito.

Respuesta ejemplo:

```json
{
  "items": [],
  "itemsCount": 0,
  "totalPrice": 0
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

## 7) Buys - `/api/buys` (todas protegidas)

### GET `/api/buys`

Lista compras.

### GET `/api/buys/{id}`

Consulta compra por id.

### GET `/api/buys/user/{email}`

Lista compras del usuario autenticado.

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

## Resumen rápido

### Públicos

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/beta/**`
- `GET /api/beta-testers/**`
- `GET /api/extensions/**`
- `GET /oauth2/authorization/{provider}`
- `GET /login/oauth2/code/{registrationId}`

### Protegidos

- `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/users/**`
- `POST/PUT/DELETE /api/extensions/**`
- `GET/POST/DELETE /api/cart/**`
- `GET/POST /api/buys/**`
- `POST/PUT/DELETE /api/beta-testers/**`
