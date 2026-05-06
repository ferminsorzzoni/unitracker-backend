import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './../../../../app.js';
import crypto from 'crypto';
import * as userRepository from './../../../auth/user.repository.js';
import * as refreshTokenRepository from './../../../auth/refreshToken.repository.js';
import * as careerRepository from "./../../career/career.repository.js";
import * as categoryRepository from "./../../category/category.repository.js";
import * as subcategoryRepository from "./../subcategory.repository.js";
import { generateAccessToken } from '../../../auth/auth.utils.js';

describe("POST /", () => {
    it("retorna 400 Bad Request si el body no existe", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .post('/api/academic/subcategories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si el body está mal formado", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .post('/api/academic/subcategories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: "",
                categoryId: "esto-no-es-un-uuid",
            });

        expect(res.status).toBe(400);
    });

    it("retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: "La mejor subcategoria",
                categoryId: category.id,
            });

        expect(res.status).toBe(403);
    });

    it("retorna 404 Not Found si no existe la Category asociada", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .post('/api/academic/subcategories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: "La mejor categoria",
                categoryId: "123e4567-e89b-12d3-a456-426614174000",
            });

        expect(res.status).toBe(404);
    });

    it("el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con Subcategory", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id
        }, 1);

        const res1 = await request(app)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor subcategoria',
                categoryId: category.id,
            });

        expect(res1.status).toBe(201);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejor subcategoria');
        expect(res1.body.order).toBe(1);
        expect(res1.body.categoryId).toBe(category.id);

        const res2 = await request(app)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La segunda mejor subcategoria',
                categoryId: category.id,
            });

        expect(res2.status).toBe(201);
        expect(res2.body).toHaveProperty('id');
        expect(res2.body.name).toBe('La segunda mejor subcategoria');
        expect(res2.body.order).toBe(2);
        expect(res2.body.categoryId).toBe(category.id);
    });

    it("el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 201 Created y el body con Subategory", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1)

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res1 = await request(app)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejor subcategoria',
                categoryId: category.id,
            });

        expect(res1.status).toBe(201);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejor subcategoria');
        expect(res1.body.order).toBe(1);
        expect(res1.body.categoryId).toBe(category.id);


        const res2 = await request(app)
            .post(`/api/academic/subcategories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La segunda mejor subcategoria',
                categoryId: category.id,
            });

        expect(res2.status).toBe(201);
        expect(res2.body).toHaveProperty('id');
        expect(res2.body.name).toBe('La segunda mejor subcategoria');
        expect(res2.body.order).toBe(2);
        expect(res2.body.categoryId).toBe(category.id);
    });
});


describe("PATCH /:subcategoryId", () => {
    it("retorna 400 Bad Request si el param subcategoryId está mal formado", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .patch('/api/academic/subcategories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({});

        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si el body está mal formado", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 1);

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: "",
                order: "hola",
            });

        expect(res.status).toBe(400);
    });

    it("retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 1);

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: "La mejorsisima subcategoria",
                order: 2,
            });

        expect(res.status).toBe(403);
    });

    it("retorna 404 Not Found si no existe un Subcategory con ese subcategoryId", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .patch('/api/academic/subcategories/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: "La mejorsisima subcategoria",
                order: 2,
            });

        expect(res.status).toBe(404);
    });

    it("el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Subcategory", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 0);

        const res = await request(app)
            .patch(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima subcategoria',
                order: 2,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejorsisima subcategoria');
        expect(res.body.order).toBe(2);
        expect(res.body.categoryId).toBe(category.id);
    });

    it("el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 200 Created y el body con Subcategory", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory1 = await subcategoryRepository.create({
            name: "La mejor subcategoria 1",
            categoryId: category.id,
        }, 1);

        const subcategory2 = await subcategoryRepository.create({
            name: "La mejor subcategoria 2",
            categoryId: category.id,
        }, 2);

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res1 = await request(app)
            .patch(`/api/academic/subcategories/${subcategory1.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima subcategoria 1',
                order: 2,
            });

        const res2 = await request(app)
            .patch(`/api/academic/subcategories/${subcategory2.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima subcategoria 2',
            });

        expect(res1.status).toBe(200);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejorsisima subcategoria 1');
        expect(res1.body.order).toBe(2);
        expect(res1.body.categoryId).toBe(category.id);

        expect(res2.status).toBe(200);
        expect(res2.body).toHaveProperty("id");
        expect(res2.body.name).toBe("La mejorsisima subcategoria 2");
        expect(res2.body.order).toBe(3);
        expect(res2.body.categoryId).toBe(category.id);
    });
});

describe("DELETE /:subcategoryId", () => {
    it("retorna 400 Bad Request si el param subcategoryId está mal formado", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .delete('/api/academic/subcategories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it("retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 1);

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(403);
    });

    it("retorna 404 Not Found si no existe un Subcategory con ese subcategoryId", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .delete('/api/academic/subcategories/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(404);
    });

    it("el usuario no es ADMIN, es exitoso y retorna 204 No Content", async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        const hashedToken = crypto
            .createHash('sha256')
            .update('test123')
            .digest('hex');
        await refreshTokenRepository.create(
            user.id,
            hashedToken,
            new Date(Date.now() + 100000),
        );

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 1);

        const res = await request(app)
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(204);
    });

    it("el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 204 No Content", async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user1.id,
        );

        const category = await categoryRepository.create({
            name: "La mejor categoria",
            careerId: career.id,
        }, 1);

        const subcategory = await subcategoryRepository.create({
            name: "La mejor subcategoria",
            categoryId: category.id,
        }, 1);

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
        });

        const hashedToken2 = crypto
            .createHash('sha256')
            .update('test1232')
            .digest('hex');
        await refreshTokenRepository.create(
            user2.id,
            hashedToken2,
            new Date(Date.now() + 100000),
        );

        const res = await request(app)
            .delete(`/api/academic/subcategories/${subcategory.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(204);
    });
});