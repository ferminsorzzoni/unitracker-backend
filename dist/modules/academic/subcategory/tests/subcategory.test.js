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
const careerRepository = __importStar(require("./../../career/career.repository.js"));
const categoryRepository = __importStar(require("./../../category/category.repository.js"));
const subcategoryRepository = __importStar(require("./../subcategory.repository.js"));
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
            .post('/api/academic/subcategories/')
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
            .post('/api/academic/subcategories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: '',
            categoryId: 'esto-no-es-un-uuid',
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
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
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe la Category asociada', async () => {
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
            .post('/api/academic/subcategories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor subcategoria',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
        });
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con Subcategory', async () => {
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
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const res1 = await (0, supertest_1.default)(app_js_1.default)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        });
        (0, vitest_1.expect)(res1.status).toBe(201);
        (0, vitest_1.expect)(res1.body).toHaveProperty('id');
        (0, vitest_1.expect)(res1.body.name).toBe('La mejor subcategoria');
        (0, vitest_1.expect)(res1.body.order).toBe(1);
        (0, vitest_1.expect)(res1.body.categoryId).toBe(category.id);
        const res2 = await (0, supertest_1.default)(app_js_1.default)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La segunda mejor subcategoria',
            categoryId: category.id,
        });
        (0, vitest_1.expect)(res2.status).toBe(201);
        (0, vitest_1.expect)(res2.body).toHaveProperty('id');
        (0, vitest_1.expect)(res2.body.name).toBe('La segunda mejor subcategoria');
        (0, vitest_1.expect)(res2.body.order).toBe(2);
        (0, vitest_1.expect)(res2.body.categoryId).toBe(category.id);
    });
    (0, vitest_1.it)('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 201 Created y el body con Subategory', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
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
        const res1 = await (0, supertest_1.default)(app_js_1.default)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        });
        (0, vitest_1.expect)(res1.status).toBe(201);
        (0, vitest_1.expect)(res1.body).toHaveProperty('id');
        (0, vitest_1.expect)(res1.body.name).toBe('La mejor subcategoria');
        (0, vitest_1.expect)(res1.body.order).toBe(1);
        (0, vitest_1.expect)(res1.body.categoryId).toBe(category.id);
        const res2 = await (0, supertest_1.default)(app_js_1.default)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La segunda mejor subcategoria',
            categoryId: category.id,
        });
        (0, vitest_1.expect)(res2.status).toBe(201);
        (0, vitest_1.expect)(res2.body).toHaveProperty('id');
        (0, vitest_1.expect)(res2.body.name).toBe('La segunda mejor subcategoria');
        (0, vitest_1.expect)(res2.body.order).toBe(2);
        (0, vitest_1.expect)(res2.body.categoryId).toBe(category.id);
    });
});
(0, vitest_1.describe)('PATCH /:subcategoryId', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param subcategoryId está mal formado', async () => {
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
            .patch('/api/academic/subcategories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({});
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 400 Bad Request si el body está mal formado', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
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
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: '',
            order: 'hola',
        });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
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
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejorsisima subcategoria',
            order: 2,
        });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe un Subcategory con ese subcategoryId', async () => {
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
            .patch('/api/academic/subcategories/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejorsisima subcategoria',
            order: 2,
        });
        (0, vitest_1.expect)(res.status).toBe(404);
    });
    (0, vitest_1.it)('el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Subcategory', async () => {
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
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 0);
        const res = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
            name: 'La mejorsisima subcategoria',
            order: 2,
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty('id');
        (0, vitest_1.expect)(res.body.name).toBe('La mejorsisima subcategoria');
        (0, vitest_1.expect)(res.body.order).toBe(2);
        (0, vitest_1.expect)(res.body.categoryId).toBe(category.id);
    });
    (0, vitest_1.it)('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 200 Created y el body con Subcategory', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory1 = await subcategoryRepository.create({
            name: 'La mejor subcategoria 1',
            categoryId: category.id,
        }, 1);
        const subcategory2 = await subcategoryRepository.create({
            name: 'La mejor subcategoria 2',
            categoryId: category.id,
        }, 2);
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
        const res1 = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/subcategories/${subcategory1.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejorsisima subcategoria 1',
            order: 2,
        });
        const res2 = await (0, supertest_1.default)(app_js_1.default)
            .patch(`/api/academic/subcategories/${subcategory2.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
            name: 'La mejorsisima subcategoria 2',
        });
        (0, vitest_1.expect)(res1.status).toBe(200);
        (0, vitest_1.expect)(res1.body).toHaveProperty('id');
        (0, vitest_1.expect)(res1.body.name).toBe('La mejorsisima subcategoria 1');
        (0, vitest_1.expect)(res1.body.order).toBe(2);
        (0, vitest_1.expect)(res1.body.categoryId).toBe(category.id);
        (0, vitest_1.expect)(res2.status).toBe(200);
        (0, vitest_1.expect)(res2.body).toHaveProperty('id');
        (0, vitest_1.expect)(res2.body.name).toBe('La mejorsisima subcategoria 2');
        (0, vitest_1.expect)(res2.body.order).toBe(3);
        (0, vitest_1.expect)(res2.body.categoryId).toBe(category.id);
    });
});
(0, vitest_1.describe)('DELETE /:subcategoryId', () => {
    (0, vitest_1.it)('retorna 400 Bad Request si el param subcategoryId está mal formado', async () => {
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
            .delete('/api/academic/subcategories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(400);
    });
    (0, vitest_1.it)('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
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
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('retorna 404 Not Found si no existe un Subcategory con ese subcategoryId', async () => {
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
            .delete('/api/academic/subcategories/123e4567-e89b-12d3-a456-426614174000')
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
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(user.id, hashedToken, new Date(Date.now() + 100000));
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
        const res = await (0, supertest_1.default)(app_js_1.default)
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
    (0, vitest_1.it)('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 204 No Content', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });
        const career = await careerRepository.create({
            name: 'La mejor carrera',
            institution: 'La mejor institucion',
        }, user1.id);
        const category = await categoryRepository.create({
            name: 'La mejor categoria',
            careerId: career.id,
        }, 1);
        const subcategory = await subcategoryRepository.create({
            name: 'La mejor subcategoria',
            categoryId: category.id,
        }, 1);
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
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');
        (0, vitest_1.expect)(res.status).toBe(204);
    });
});
