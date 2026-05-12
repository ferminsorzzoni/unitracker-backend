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
  - `400 Bad Request`: Invalid body format.
  - `409 Conflict`: Email already registered.

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
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Invalid credentials.

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
  - `401 Unauthorized`: Invalid or expired Refresh Token.
  - `404 Not Found`: User not found.

#### POST `/api/auth/logout`
- Cierra la sesión actual e invalida el Refresh Token. Requiere Auth.
- Cookies esperadas:
  ```http
  refreshToken=<token>
  ```
- Respuesta exitosa:
  - Código: `204 No Content`
- Errores:
  - `400 Bad Request`: Invalid cookie format.
  - `401 Unauthorized`: Unauthorized user.

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
  - `401 Unauthorized`: Failed Google Auth.


## Academic
### Career
#### POST `/api/academic/careers`
- Crea una nueva Career. Requiere Auth.
- Body esperado:
  ```json
    {
      "name": "Example Career",
      "institution": "University of Examples" (optional),
      "isOfficial": false (optional),
    }
  ```
- Respuesta exitosa:
  - Código: `201 Created`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples",
      "isOfficial": false,
      "userId": "3userexample42",
    }
    ```
- Errores:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User is not ADMIN, cannot set isOfficial.

#### GET `/api/academic/careers/:careerId`
- Obtiene una Career.
- Respuesta exitosa:
  - Código: `200 OK`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples",
      "isOfficial": false,
      "userId": "3userexample42",
      "categories": [categoryExample1, categoryExample2, categoryExampleN],
    }
    ```
- Errores:
  - `400 Bad Request`: Invalid param format.
  - `404 Not Found`: Career not found.

#### PATCH `/api/academic/careers/:careerId`
- Actualiza una Career. Requiere Auth.
- Body esperado:
  ```json
  {
    "name": "Example Career" (opcional),
    "institution": "University of Examples" (opcional),
    "isOfficial": false (opcional),
  }
  ```
- Respuesta exitosa:
  - Código: `200 OK`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples",
      "isOfficial": false,
      "userId": "3userexample42",
      "categories": [categoryExample1, categoryExample2, categoryExampleN],
    }
    ```
- Errores:
  - `400 Bad Request`: Invalid body or param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career / User is not ADMIN, cannot set isOfficial.
  - `404 Not Found`: Career not found.

#### DELETE `/api/academic/careers/:careerId`
- Borra una Career. Requiere Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Career not found.

#### POST `/api/academic/careers/:careerId/clone`
- Clona una Career (sin tener en cuenta el progreso del usuario original). Requiere Auth.
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples",
      "isOfficial": false,
      "userId": "3userexample42",
      "categories": [categoryExample1, categoryExample2, categoryExampleN],
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: Unauthorized user.
  - `404 Not Found`: Career not found.


### Category
#### POST `/api/academic/categories`
- Crea una nueva Category. Requires Auth.
- Required body:
  ```json
  {
    "name": "Example Category",
    "careerId": "1examplecareer7",
  }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "123examplecategory4",
      "name": "Example Category",
      "careerId": "1examplecareer7",
      "order": 1,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.

#### PATCH `/api/academic/categories/:categoryId`
- Actualiza una Category. Requires Auth.
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "id": "123examplecategory4",
      "name": "Example Category",
      "careerId": "1examplecareer7",
      "order": 1,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body or param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Category not found.

#### DELETE `/api/academic/categories/:categoryId`
- Borra una Category. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Category not found.

### Subcategory
#### POST `/api/academic/subcategories`
- Crea una nueva Subcategory. Requires Auth.
- Required body:
  ```json
  {
    "name": "Example Subcategory",
    "categoryId": "57examplecategory6"
  }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "2examplesubcategory63",
      "categoryId": "57examplecategory6",
      "name": "Example Subcategory",
      "order": 1,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.

#### PATCH `/api/academic/subcategories/:subcategoryId`
- Actualiza una Subcategory. Requires Auth.
- Required body:
  ```json
  {
    "name": "Subcategory Example" (optional),
    "order": 1 (optional),
  }
  ```
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "id": "2examplesubcategory63",
      "categoryId": "57examplecategory6",
      "name": "Example Subcategory",
      "order": 1,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body or param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Subcategory not found.

#### DELETE `/api/academic/subcategories/:subcategoryId`
- Borra una Subcategory. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Subcategory not found.

### Subject
#### POST `/api/academic/subjects`
- Crea un nuevo Subject.
- Success response:
- Errors:

#### PATCH `/api/academic/subjects/:subjectId`
- Actualiza un Subject.
- Success response:
- Errors:

#### DELETE `/api/academic/subjects/:subjectId`
- Borra un Subject.
- Success response:
- Errors:


### Prerequisite
#### POST `/api/academic/prerequisites`
- Crea un nuevo Prerequisite.
- Success response:
- Errors:

#### DELETE `/api/academic/prerequisites/:prerequisiteId`
- Borra un Prerequisite.
- Success response:
- Errors:
