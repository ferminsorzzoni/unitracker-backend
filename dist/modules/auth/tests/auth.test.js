"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("./../../../app.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userRepository = __importStar(require("./../user.repository.js"));
const refreshTokenRepository = __importStar(require("./../refreshToken.repository.js"));
const auth_utils_js_1 = require("../auth.utils.js");
(0, vitest_1.describe)('/refresh', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si la cookie "refreshToken" no existe', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/refresh');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si la cookie "refreshToken" está mal formada', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/refresh')
            .set('Cookie', 'refreshToken=');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 401 Unauthorized si no existe el refreshToken en la DB', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/refresh')
            .set('Cookie', 'refreshToken=abc123');
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('retorna 401 Unauthorized si el refreshToken expiró', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'test',
            name: 'Juan Test',
        });
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() - 1000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/refresh')
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('es exitoso y retorna 200 OK y el body con "accessToken"', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/refresh')
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('accessToken');
    });
});
(0, vitest_1.describe)('/register', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el body no existe', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/register');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si el body está mal formado', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send({
            email: 'testtest',
            password: 'test',
            name: 't',
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 409 Conflict si el email ya está registrado', async () => {
        await userRepository.create({
            email: 'test@test.com',
            password: 'test',
            name: 'Juan Test',
        });
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        (0, vitest_1.expect)(res.status).toBe(409);
    });
    (0, vitest_1.it)('es exitoso y retorna 201 Created, la cookie "refreshToken" y el body con "accessToken"', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/register').send({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.headers['set-cookie'][0]).toContain('refreshToken');
        (0, vitest_1.expect)(res.body).toHaveProperty('accessToken');
        (0, vitest_1.expect)(res.body.user).toMatchObject({
            id: vitest_1.expect.any(String),
            role: 'USER',
            email: 'test@test.com',
        });
    });
});
(0, vitest_1.describe)('/login', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el body no existe', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/login');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si el body está mal formado', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/login')
            .send({ email: 'testtest', password: 'test' });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 401 Unauthorized si las credenciales no son correctas', async () => {
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/login').send({
            email: 'test@test.com',
            password: 'passwordtest',
        });
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('es exitoso y retorna 200 OK, la cookie "refreshToken" y el body con "accessToken"', async () => {
        const hashedPassword = await bcrypt_1.default.hash('testpassword', 10);
        await userRepository.create({
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Juan Test',
        });
        const res = await (0, supertest_1.default)(app_js_1.default).post('/api/auth/login').send({
            email: 'test@test.com',
            password: 'testpassword',
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.headers['set-cookie'][0]).toContain('refreshToken');
        (0, vitest_1.expect)(res.body).toHaveProperty('accessToken');
        (0, vitest_1.expect)(res.body.user).toMatchObject({
            id: vitest_1.expect.any(String),
            role: 'USER',
            email: 'test@test.com',
        });
    });
});
(0, vitest_1.describe)('/logout', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si la cookie "refreshToken" no existe', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = (0, auth_utils_js_1.generateAccessToken)({
            id: user.id,
            role: user.role,
            email: user.email,
        });
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`);
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si la cookie "refreshToken" esta mal formada', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = (0, auth_utils_js_1.generateAccessToken)({
            id: user.id,
            role: user.role,
            email: user.email,
        });
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('es exitoso y retorna 204 No Content', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = (0, auth_utils_js_1.generateAccessToken)({
            id: user.id,
            role: user.role,
            email: user.email,
        });
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
});
