# Descripción
Unitracker es una aplicación web para el seguimiento del progreso académico. Permite a los usuarios cargar el plan de estudios de su carrera, registrar el estado de cada materia y visualizar qué materias tienen disponbles para cursar según sus correlativas.
Entre las características principales del backend se encuentran la autenticación con email/password y Google OAuth, gestión de carreras personalizables, seguimiento del estado de las materias, sistema de correlativas y clonado de carreras para compartir planes de estudio.

# Configuración
## Variables de entorno
Para levantar el ambiente se necesitan especificar las siguientes variables de entorno:
- JWT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- BASE_URL
- DATABASE_URL

## Scripts
- `npm run dev`: Inicia el servidor en modo desarrollo usando tsx con watch.
- `npm run build`: Compila TypeScript a JavaScript usando tsc.
- `npm start`: Ejecuta la versión compilada en dist/server.js.
- `npm test`: Ejecuta los test usando Vitest.
- `npm run lint`: Ejecuta ESLint.
- `npm run format`: Formatea el código usando Prettier.

# Autenticación
La API utiliza autenticación basada en JWT mediante Bearer Tokens.
Los endpoints protegidos requieren el siguiente header:
```http
Authorization: Bearer <access_token>
```
El Access Token se obtiene al iniciar sesión o registrarse.
Cuando el Access Token expira, se renueva utilizando el Refresh Token, que se almacena en una cookie HTTP-only llamada "refreshToken".

# Endpoints
## Auth
#### POST `/api/auth/register`
- Crea una nueva cuenta de usuario.
- Body esperado:
  ```json
  {
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
  }
  ```
- Respuesta exitosa:
  - Código: `201 Created`
  - Body:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errores:
  - `400 Bad Request`: Formato inválido del body.
  - `409 Conflict`: Conflicto con credenciales repetidas en la DB.

#### POST `/api/auth/login`
- Inicia sesión y devuelve los tokens de autenticación.
- Body esperado:
  ```json
  {
    email: "user@example.com",
    password: "password123",
  }
  ```
- Respuesta exitosa:
  - Código: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errores:
  - `400 Bad Request`: Formato inválido del body.
  - `401 Unauthorized`: Credenciales inválidas.

#### POST `/api/auth/refresh`
- Genera un nuevo Access Token usando el Refresh Token.
- Cookies esperadas:
  ```http
  refreshToken=<token>
  ```
- Respuesta exitosa:
  - Código: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```
- Errores:
  - `401 Unauthorized`: Refresh token inválido o expirado.
  - `404 Not Found`: Usuario no encontrado.

#### POST `/api/auth/logout`
- Cierra la sesión actual e invalida el Refresh Token.
- Cookies esperadas:
  ```http
  refreshToken=<token>
  ```
- Respuesta exitosa:
  - Código: `204 No Content`
- Errores:
  - `400 Bad Request`: Formato inválido de la cookie.
  - `401 Unauthorized`: Unauthorized.

#### GET `/api/auth/google`
- Inicia el flujo OAuth con Google.

#### GET `/api/auth/google/callback`
- Callback utilizado por Google OAuth luego de la autenticación.
- Respuesta exitosa:
  - Código: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errores:
  - `401 Unauthorized`: Fallo auth de Google


## Academic
### Career
#### POST `/api/academic/careers`

#### GET `/api/academic/careers/:careerId`

#### PATCH `/api/academic/careers/:careerId`

#### DELETE `/api/academic/careers/:careerId`

#### POST `/api/academic/careers/:careerId/clone`


### Category
#### POST `/api/academic/categories`

#### PATCH `/api/academic/categories/:categoryId`

#### DELETE `/api/academic/categories/:categoryId`


### Subcategory
#### POST `/api/academic/subcategories`

#### PATCH `/api/academic/subcategories/:subcategoryId`

#### DELETE `/api/academic/subcategories/:subcategoryId`


### Subject
#### POST `/api/academic/subjects`

#### PATCH `/api/academic/subjects/:subjectId`

#### DELETE `/api/academic/subjects/:subjectId`


### Prerequisite
#### POST `/api/academic/prerequisites`

#### DELETE `/api/academic/prerequisites/:prerequisiteId`
