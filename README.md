# Description
Unitracker is a web application for tracking academic progress. It allows users to upload their degree plan, record the status of each subject, and visualize which subjects are available to take based on their prerequisites.
Key backend features include email/password and Google OAuth authentication, customizable degree management, subject status tracking, a prerequisites system, and career cloning for sharing study plans.

# Configuration
## Environment variables
The following Environment Variables are required:
- JWT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- BASE_URL
- DATABASE_URL

## Scripts
- `npm run dev`: Initializes the server in dev mode using tsx watch.
- `npm run build`: Compiles TypeScript to JavaScript using tsc.
- `npm start`: Starts compiled file from dist/server.js.
- `npm test`: Executes test with Vitest.
- `npm run lint`: Executes ESLint.
- `npm run format`: Formats code using Prettier.

# Auth
The API implements authentication using JWT with Bearer Tokens.
Protected endpoints require the following header:
```http
Authorization: Bearer <access_token>
```
The Access Token is obtained when logging-in or signing-up.
When the Access Token expires, a new one is obtained using the Refresh Token, which is saved in a HTTP-only cookie "refreshToken".

# Endpoints
## Auth
#### POST `/api/auth/register`
- Creates new User.
- Required body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
  }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "accessToken": "jwt_token",
      "user": {
        "id": "this-is-uuid",
        "role": "USER",
        "email": "user@example.com",
      },
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `409 Conflict`: Email already registered.

#### POST `/api/auth/login`
- Login and returns auth tokens.
- Required body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
  }
  ```
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token",
      "user": {
        "id": "this-is-uuid",
        "role": "USER",
        "email": "user@example.com",
      },
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Invalid credentials.

#### POST `/api/auth/refresh`
- Creates new Access Token using the Refresh Token..
- Required cookies:
  ```http
  refreshToken=<token>
  ```
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```
- Errors:
  - `401 Unauthorized`: Invalid or expired Refresh Token.
  - `404 Not Found`: User not found.

#### POST `/api/auth/logout`
- Logout and invalidates Refresh Token. Requires Auth.
- Required cookies:
  ```http
  refreshToken=<token>
  ```
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid cookie format.
  - `401 Unauthorized`: Unauthorized user.

#### GET `/api/auth/google`
- Starts Google OAuth.

#### GET `/api/auth/google/callback`
- Callback used by Google OAuth.
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "accessToken": "jwt_token",
      "user": {
        "id": "this-is-uuid",
        "role": "USER",
        "email": "user@example.com",
      },
    }
    ```
  - Cookie:
    ```http
    Set-Cookie: refreshToken=<token>; HttpOnly
    ```
- Errors:
  - `401 Unauthorized`: Failed Google Auth.


## Academic
### Career
#### POST `/api/academic/careers`
- Creates new Career. Requires Auth.
- Required body:
  ```json
    {
      "name": "Example Career",
      "institution": "University of Examples" (optional),
      "isOfficial": false (optional),
    }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples" | null,
      "isOfficial": false,
      "userId": "3userexample42",
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User is not ADMIN, cannot set isOfficial.

#### GET `/api/academic/careers/:careerId`
- Gets a Career.
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples" | null,
      "isOfficial": false,
      "userId": "3userexample42",
      "categories": [
          {
            "id": "123examplecategory4",
            "name": "Example Category",
            "careerId": "1example7",
            "order": 1,
            "subcategories": [
                  {
                    "id": "56examplesubcategory2",
                    "name": "Example Subcategory",
                    "categoryId": "123examplecategory4",
                    "order": 1,
                    "subjects": [
                      {
                        "id": "11examplesubject0",
                        "mark": 8 | null,
                        "name": "Example Subject",
                        "state": "PENDING",
                        "weeklyMinutes": 120 | null,
                        "subcategoryId": "56examplesubcategory2",
                        "prerequisites": [
                          {
                            "id": "exampleprerequisite532",
                            "type": "PASSED",
                            "subjectId": "11examplesubject0",
                            "prerequisiteId": "07exampleprerequisitesubject32",
                          }
                        ],
                      }
                    ],
                  }
            ],
          }
      ],
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `404 Not Found`: Career not found.

#### PATCH `/api/academic/careers/:careerId`
- Updates a Career. Requires Auth.
- Required body:
  ```json
  {
    "name": "Example Career" (opcional),
    "institution": "University of Examples" (opcional),
    "isOfficial": false (opcional),
  }
  ```
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples" | null,
      "isOfficial": false,
      "userId": "3userexample42",
      "categories": [categoryExample1, categoryExample2, categoryExampleN],
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body or param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career / User is not ADMIN, cannot set isOfficial.
  - `404 Not Found`: Career not found.

#### DELETE `/api/academic/careers/:careerId`
- Deletes a Career. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Career not found.

#### POST `/api/academic/careers/:careerId/clone`
- Clones a Career (without user's original progress). Requires Auth.
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "1example7",
      "name": "Example Career",
      "institution": "University of Examples" | null,
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
- Creates a new Category. Requires Auth.
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
  - `404 Not Found`: CareerId not found.

#### PATCH `/api/academic/categories/:categoryId`
- Updates a Category. Requires Auth.
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
- Deletes a Category. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: Unauthorized user.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Category not found.

### Subcategory
#### POST `/api/academic/subcategories`
- Creates a new Subcategory. Requires Auth.
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
  - `404 Not Found`: CateogryId not found.

#### PATCH `/api/academic/subcategories/:subcategoryId`
- Updates a Subcategory. Requires Auth.
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
- Deletes a Subcategory. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Subcategory not found.

### Subject
#### POST `/api/academic/subjects`
- Creates a new Subject. Requires Auth.
- Required body:
  ```json
  {
    "name": "Example Subject",
    "weeklyMinutes": 60 (optional),
    "subcategoryId": "47examplesubcategory9",
  }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "02examplesubject33",
      "mark": 8 | null,
      "name": "Example Subject",
      "state": "PENDING",
      "subcategoryId": "47examplesubcategory9",
      "weeklyMinutes": 60 | null,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: SubcategoryId not found.

#### PATCH `/api/academic/subjects/:subjectId`
- Updates a Subject. Requires Auth.
- Required body:
  ```json
  {
    "name": "Example Subject" (optional),
    "mark": 7 (optional),
    "state": "PASSED" (optional),
    "weeklyMinutes": 60 (optional),
  }
  ```
- Success response:
  - HTTP Code: `200 OK`
  - Body:
    ```json
    {
      "id": "02examplesubject33",
      "mark": 7 | null,
      "name": "Example Subject",
      "state": "PASSED",
      "subcategoryId": "47examplesubcategory9",
      "weeklyMinutes": 60 | null,
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body or param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Subject not found.

#### DELETE `/api/academic/subjects/:subjectId`
- Deletes a Subject. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Subject not found.

### Prerequisite
#### POST `/api/academic/prerequisites`
- Creates a new Prerequisite. Requires Auth.
- Required body:
  ```json
  {
    "type": "PASSED",
    "subjectId": "02examplesubject33",
    "prerequisiteId": "11exampleprerequisitesubject0",
  }
  ```
- Success response:
  - HTTP Code: `201 Created`
  - Body:
    ```json
    {
      "id": "7exampleprerequisite99",
      "subjectId": "02examplesubject33",
      "prerequisiteId": "11exampleprerequisitesubject0",
      "type": "PASSED",
    }
    ```
- Errors:
  - `400 Bad Request`: Invalid body format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: SubjectId/PrerequisiteId not found.

#### DELETE `/api/academic/prerequisites/:prerequisiteId`
- Deletes a Prerequisite. Requires Auth.
- Success response:
  - HTTP Code: `204 No Content`
- Errors:
  - `400 Bad Request`: Invalid param format.
  - `401 Unauthorized`: User unauthorized.
  - `403 Forbidden`: User does not own the career.
  - `404 Not Found`: Prerequisite not found.
