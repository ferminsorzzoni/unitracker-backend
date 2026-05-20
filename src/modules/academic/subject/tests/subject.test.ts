import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './../../../../app.js';
import crypto from 'crypto';
import * as userRepository from './../../../auth/user.repository.js';
import * as refreshTokenRepository from './../../../auth/refreshToken.repository.js';
import * as careerRepository from './../../career/career.repository.js';
import * as categoryRepository from './../../category/category.repository.js';
import * as subcategoryRepository from './../../subcategory/subcategory.repository.js';
import * as subjectRepository from './../subject.repository.js';
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
            email: user.email,
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
            .post('/api/academic/subjects/')
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
            email: user.email,
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
            .post('/api/academic/subjects/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                weeklyMinutes: 'hola',
                subcategoryId: 'esto-no-es-un-uuid',
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
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
            email: user2.email,
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
            .post(`/api/academic/subjects/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejor materia',
                weeklyMinutes: 2,
                subcategoryId: subcategory.id,
            });

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe la Subcategory asociada', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
            .post('/api/academic/subjects/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor materia',
                weeklyMinutes: 2,
                subcategoryId: '123e4567-e89b-12d3-a456-426614174000',
            });

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con Subject', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const res = await request(app)
            .post(`/api/academic/subjects/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor materia',
                weeklyMinutes: 120,
                subcategoryId: subcategory.id,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejor materia');
        expect(res.body.weeklyMinutes).toBe(120);
        expect(res.body.subcategoryId).toBe(subcategory.id);
    });

    it('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 201 Created y el body con Subject', async () => {
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
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
            email: user2.email,
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
            .post(`/api/academic/subjects/`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejor materia',
                weeklyMinutes: 120,
                subcategoryId: subcategory.id,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejor materia');
        expect(res.body.weeklyMinutes).toBe(120);
        expect(res.body.subcategoryId).toBe(subcategory.id);
    });
});

describe('PATCH /:subjectId', () => {
    it('retorna 400 Bad Request si el param subjectId está mal formado', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
            .patch('/api/academic/subjects/esto-no-es-uuid')
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
            .patch(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                weeklyMinutes: 'hola',
                mark: 'hola',
                state: 1,
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
            email: user2.email,
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
            .patch(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima materia',
                weeklyMinutes: 60,
                mark: 6,
                state: 'PASSED',
            });

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe un Subject con ese subjectId', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
                '/api/academic/subjects/123e4567-e89b-12d3-a456-426614174000',
            )
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima materia',
                weeklyMinutes: 60,
                mark: 6,
                state: 'PASSED',
            });

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Subject', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            0,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const res = await request(app)
            .patch(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima materia',
                weeklyMinutes: 60,
                mark: 6,
                state: 'PASSED',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejorsisima materia');
        expect(res.body.weeklyMinutes).toBe(60);
        expect(res.body.mark).toBe(6);
        expect(res.body.state).toBe('PASSED');
        expect(res.body.subcategoryId).toBe(subcategory.id);
    });

    it('el usuario es ADMIN, no tiene ownership sobre la Career asociada, es exitoso y retorna 200 Created y el body con Subject', async () => {
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
            email: user2.email,
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
            .patch(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima materia',
                weeklyMinutes: 60,
                mark: 6,
                state: 'PASSED',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejorsisima materia');
        expect(res.body.weeklyMinutes).toBe(60);
        expect(res.body.mark).toBe(6);
        expect(res.body.state).toBe('PASSED');
        expect(res.body.subcategoryId).toBe(subcategory.id);
    });
});

describe('DELETE /:subjectId', () => {
    it('retorna 400 Bad Request si el param subjectId está mal formado', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
            .delete('/api/academic/subjects/esto-no-es-uuid')
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
            email: user2.email,
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
            .delete(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe un Subject con ese subjectId', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
        });
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            email: user.email,
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
                '/api/academic/subjects/123e4567-e89b-12d3-a456-426614174000',
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
            email: user.email,
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const res = await request(app)
            .delete(`/api/academic/subjects/${subject.id}`)
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

        const subcategory = await subcategoryRepository.create(
            {
                name: 'La mejor subcategoria',
                categoryId: category.id,
            },
            1,
        );

        const subject = await subjectRepository.create({
            name: 'La mejor materia',
            weeklyMinutes: 120,
            subcategoryId: subcategory.id,
        });

        const user2 = await userRepository.create({
            email: 'test2@test.com',
            password: 'testpassword2',
            name: 'Juan Test',
            role: 'ADMIN',
        });
        const accessToken2 = generateAccessToken({
            id: user2.id,
            role: user2.role,
            email: user2.email,
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
            .delete(`/api/academic/subjects/${subject.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(204);
    });
});
