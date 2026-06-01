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
const app_js_1 = __importDefault(require("./../../../../app.js"));
const crypto_1 = __importDefault(require("crypto"));
const userRepository = __importStar(require("./../../../auth/user.repository.js"));
const refreshTokenRepository = __importStar(require("./../../../auth/refreshToken.repository.js"));
const careerRepository = __importStar(require("./../career.repository.js"));
const categoryRepository = __importStar(require("./../../category/category.repository.js"));
const subcategoryRepository = __importStar(require("./../../subcategory/subcategory.repository.js"));
const subjectRepository = __importStar(require("./../../subject/subject.repository.js"));
const prerequisiteRepository = __importStar(require("./../../prerequisite/prerequisite.repository.js"));
const auth_utils_js_1 = require("../../../auth/auth.utils.js");
(0, vitest_1.describe)('POST /', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el body no existe', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si el body está mal formado', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: '',
            institution: 1,
            isOfficial: 'hola',
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si un no ADMIN intenta subir una carrera con isOfficial', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
            isOfficial: true,
        });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con "Career"', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toHaveProperty('id');
        (0, vitest_1.expect)(res.body.name).toBe('La mejor carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejor institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(false);
        (0, vitest_1.expect)(res.body.userId).toBe(user.id);
    });
    (0, vitest_1.it)('el usuario es ADMIN, es exitoso y retorna 201 Created y el body con Career', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
            role: 'ADMIN',
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
            isOfficial: true,
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toHaveProperty('id');
        (0, vitest_1.expect)(res.body.name).toBe('La mejor carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejor institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(true);
        (0, vitest_1.expect)(res.body.userId).toBe(user.id);
    });
});
(0, vitest_1.describe)('GET /:careerId', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .get('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe una "Career" con ese careerId', async () => {
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
            .get('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('es exitoso y retorna 200 OK y el body con "Career"', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
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
            .get(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).toBe(career.id);
        (0, vitest_1.expect)(res.body.name).toBe('La mejor carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejor institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(false);
        (0, vitest_1.expect)(res.body.userId).toBe(user.id);
        (0, vitest_1.expect)(res.body).toHaveProperty('categories');
    });
});
(0, vitest_1.describe)('PATCH /:careerId', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .patch('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
            isOfficial: false,
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si el body está mal formado', async () => {
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
            .patch('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: '',
            institution: 1,
            isOfficial: 'hola',
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si no tiene ownership sobre la "Career" y no es ADMIN', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = (0, auth_utils_js_1.generateAccessToken)({
            id: user2.id,
            role: user2.role,
            email: user2.email,
        });
        const hashedToken2 = crypto_1.default
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(user2.id, hashedToken2, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({});
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si un no ADMIN intenta modificar una carrera a isOfficial', async () => {
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
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
        const res = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            isOfficial: true,
        });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe una Career con ese careerId', async () => {
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
            .patch('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({});
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Career', async () => {
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
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
        const res = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejorsisima carrera',
            institution: 'La mejorsisima institucion',
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).toBe(career.id);
        (0, vitest_1.expect)(res.body.name).toBe('La mejorsisima carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejorsisima institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(false);
        (0, vitest_1.expect)(res.body.userId).toBe(user.id);
    });
    (0, vitest_1.it)('el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 200 OK y el body con Career', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = (0, auth_utils_js_1.generateAccessToken)({
            id: user2.id,
            role: user2.role,
            email: user2.email,
        });
        const hashedToken2 = crypto_1.default
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(user2.id, hashedToken2, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejorsisima carrera',
            institution: 'La mejorsisima institucion',
            isOfficial: true,
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).toBe(career.id);
        (0, vitest_1.expect)(res.body.name).toBe('La mejorsisima carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejorsisima institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(true);
        (0, vitest_1.expect)(res.body.userId).toBe(user1.id);
    });
});
(0, vitest_1.describe)('DELETE /:careerId', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .delete('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si no tiene ownership sobre Career y no es ADMIN', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = (0, auth_utils_js_1.generateAccessToken)({
            id: user2.id,
            role: user2.role,
            email: user2.email,
        });
        const hashedToken2 = crypto_1.default
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(user2.id, hashedToken2, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe una Career con ese careerId', async () => {
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
            .delete('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('el usuario no es ADMIN, es exitoso y retorna 204 No Content', async () => {
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
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
        const res = await (0, supertest_1.default)(app_js_1.default)
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
    (0, vitest_1.it)('el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 204 No Content', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = (0, auth_utils_js_1.generateAccessToken)({
            id: user2.id,
            role: user2.role,
            email: user2.email,
        });
        const hashedToken2 = crypto_1.default
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(user2.id, hashedToken2, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
});
(0, vitest_1.describe)('POST /:careerId/clone', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .post('/api/academic/careers/esto-no-es-uuid/clone')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe una "Career" con ese careerId', async () => {
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
            .post('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000/clone')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('es exitoso y retorna 201 Created y el body con Career', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
            isOfficial: true,
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
        const subject1 = await subjectRepository.create({
            name: 'La mejor materia 1',
            weeklyMinutes: 2,
            subcategoryId: subcategory.id,
        }, 1);
        const subject2 = await subjectRepository.create({
            name: 'La mejor materia 2',
            weeklyMinutes: 2,
            subcategoryId: subcategory.id,
        }, 2);
        const prerequisite = await prerequisiteRepository.create({
            type: 'PASSED',
            subjectId: subject1.id,
            prerequisiteId: subject2.id,
        });
        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = (0, auth_utils_js_1.generateAccessToken)({
            id: user2.id,
            role: user2.role,
            email: user2.email,
        });
        const hashedToken2 = crypto_1.default
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(user2.id, hashedToken2, new Date(Date.now() + 100000));
        const res = await (0, supertest_1.default)(app_js_1.default)
            .post(`/api/academic/careers/${career.id}/clone`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.id).not.toBe(career.id);
        (0, vitest_1.expect)(res.body.name).toBe('La mejor carrera');
        (0, vitest_1.expect)(res.body.institution).toBe('La mejor institucion');
        (0, vitest_1.expect)(res.body.isOfficial).toBe(false);
        (0, vitest_1.expect)(res.body.userId).toBe(user2.id);
        const clonedCategory = res.body.categories[0];
        (0, vitest_1.expect)(clonedCategory.id).not.toBe(category.id);
        (0, vitest_1.expect)(clonedCategory.name).toBe('La mejor categoria');
        (0, vitest_1.expect)(clonedCategory.order).toBe(1);
        (0, vitest_1.expect)(clonedCategory.careerId).toBe(res.body.id);
        const clonedSubcategory = clonedCategory.subcategories[0];
        (0, vitest_1.expect)(clonedSubcategory.id).not.toBe(subcategory.id);
        (0, vitest_1.expect)(clonedSubcategory.name).toBe('La mejor subcategoria');
        (0, vitest_1.expect)(clonedSubcategory.order).toBe(1);
        (0, vitest_1.expect)(clonedSubcategory.categoryId).toBe(clonedCategory.id);
        const clonedSubject1 = clonedSubcategory.subjects[0];
        const clonedSubject2 = clonedSubcategory.subjects[1];
        (0, vitest_1.expect)(clonedSubject1.id).not.toBe(subject1.id);
        (0, vitest_1.expect)(clonedSubject1.name).toBe('La mejor materia 1');
        (0, vitest_1.expect)(clonedSubject1.weeklyMinutes).toBe(2);
        (0, vitest_1.expect)(clonedSubject1.subcategoryId).toBe(clonedSubcategory.id);
        (0, vitest_1.expect)(clonedSubject2.id).not.toBe(subject2.id);
        (0, vitest_1.expect)(clonedSubject2.name).toBe('La mejor materia 2');
        (0, vitest_1.expect)(clonedSubject2.weeklyMinutes).toBe(2);
        (0, vitest_1.expect)(clonedSubject2.subcategoryId).toBe(clonedSubcategory.id);
        const clonedPrerequisite = clonedSubject1.prerequisites[0];
        (0, vitest_1.expect)(clonedPrerequisite.id).not.toBe(prerequisite.id);
        (0, vitest_1.expect)(clonedPrerequisite.type).toBe('PASSED');
        (0, vitest_1.expect)(clonedPrerequisite.subjectId).toBe(clonedSubject1.id);
        (0, vitest_1.expect)(clonedPrerequisite.prerequisiteId).toBe(clonedSubject2.id);
    });
});
