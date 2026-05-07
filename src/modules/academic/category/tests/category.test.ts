import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './../../../../app.js';
import crypto from 'crypto';
import * as userRepository from './../../../auth/user.repository.js';
import * as refreshTokenRepository from './../../../auth/refreshToken.repository.js';
import * as careerRepository from './../../career/career.repository.js';
import * as categoryRepository from './../category.repository.js';
import { generateAccessToken } from '../../../auth/auth.utils.js';

describe('POST /', () => {
    it('retorna 400 Bad Request si el body no existe', async () => {
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
            .post('/api/academic/categories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it('retorna 400 Bad Request si el body está mal formado', async () => {
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
            .post('/api/academic/categories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                careerId: 'esto-no-es-un-uuid',
            });

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
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
            .post(`/api/academic/categories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejor categoria',
                careerId: career.id,
            });

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe la Career asociada', async () => {
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
            .post('/api/academic/categories/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor categoria',
                careerId: '123e4567-e89b-12d3-a456-426614174000',
            });

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con Category', async () => {
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

        const res1 = await request(app)
            .post(`/api/academic/categories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor categoria',
                careerId: career.id,
            });

        expect(res1.status).toBe(201);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejor categoria');
        expect(res1.body.order).toBe(1);
        expect(res1.body.careerId).toBe(career.id);

        const res2 = await request(app)
            .post(`/api/academic/categories/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La segunda mejor categoria',
                careerId: career.id,
            });

        expect(res2.status).toBe(201);
        expect(res2.body).toHaveProperty('id');
        expect(res2.body.name).toBe('La segunda mejor categoria');
        expect(res2.body.order).toBe(2);
        expect(res2.body.careerId).toBe(career.id);
    });

    it('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 201 Created y el body con Category', async () => {
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
            .post(`/api/academic/categories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejor categoria',
                careerId: career.id,
            });

        expect(res1.status).toBe(201);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejor categoria');
        expect(res1.body.order).toBe(1);
        expect(res1.body.careerId).toBe(career.id);

        const res2 = await request(app)
            .post(`/api/academic/categories/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La segunda mejor categoria',
                careerId: career.id,
            });

        expect(res2.status).toBe(201);
        expect(res2.body).toHaveProperty('id');
        expect(res2.body.name).toBe('La segunda mejor categoria');
        expect(res2.body.order).toBe(2);
        expect(res2.body.careerId).toBe(career.id);
    });
});

describe('PATCH /:categoryId', () => {
    it('retorna 400 Bad Request si el param categoryId está mal formado', async () => {
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
            .patch('/api/academic/categories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({});

        expect(res.status).toBe(400);
    });

    it('retorna 400 Bad Request si el body está mal formado', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

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
            .patch(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                order: 'hola',
            });

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

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
            .patch(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima categoria',
                order: 2,
            });

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe un Category con ese categoryId', async () => {
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
            .patch(
                '/api/academic/categories/123e4567-e89b-12d3-a456-426614174000',
            )
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima categoria',
                order: 2,
            });

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Category', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

        const res = await request(app)
            .patch(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima categoria',
                order: 2,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejorsisima categoria');
        expect(res.body.order).toBe(2);
        expect(res.body.careerId).toBe(career.id);
    });

    it('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 200 Created y el body con Category', async () => {
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

        const category1 = await categoryRepository.create(
            {
                name: 'La mejor categoria 1',
                careerId: career.id,
            },
            1,
        );

        const category2 = await categoryRepository.create(
            {
                name: 'La mejor categoria 2',
                careerId: career.id,
            },
            2,
        );

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
            .patch(`/api/academic/categories/${category1.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima categoria 1',
                order: 2,
            });

        const res2 = await request(app)
            .patch(`/api/academic/categories/${category2.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima categoria 2',
            });

        expect(res1.status).toBe(200);
        expect(res1.body).toHaveProperty('id');
        expect(res1.body.name).toBe('La mejorsisima categoria 1');
        expect(res1.body.order).toBe(2);
        expect(res1.body.careerId).toBe(career.id);

        expect(res2.status).toBe(200);
        expect(res2.body).toHaveProperty('id');
        expect(res2.body.name).toBe('La mejorsisima categoria 2');
        expect(res2.body.order).toBe(3);
        expect(res2.body.careerId).toBe(career.id);
    });
});

describe('DELETE /:categoryId', () => {
    it('retorna 400 Bad Request si el param categoryId está mal formado', async () => {
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
            .delete('/api/academic/categories/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si no tiene ownership sobre la Career asociada y el usuario no es ADMIN', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

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
            .delete(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe un Category con ese categoryId', async () => {
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
            .delete(
                '/api/academic/categories/123e4567-e89b-12d3-a456-426614174000',
            )
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 204 No Content', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

        const res = await request(app)
            .delete(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(204);
    });

    it('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 204 No Content', async () => {
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

        const category = await categoryRepository.create(
            {
                name: 'La mejor categoria',
                careerId: career.id,
            },
            1,
        );

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
            .delete(`/api/academic/categories/${category.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(204);
    });
});
