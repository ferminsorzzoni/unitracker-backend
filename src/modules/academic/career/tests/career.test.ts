import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './../../../../app.js';
import crypto from 'crypto';
import * as userRepository from './../../../auth/user.repository.js';
import * as refreshTokenRepository from './../../../auth/refreshToken.repository.js';
import * as careerRepository from './../career.repository.js';
import * as categoryRepository from './../../category/category.repository.js';
import * as subcategoryRepository from './../../subcategory/subcategory.repository.js';
import * as subjectRepository from './../../subject/subject.repository.js';
import * as prerequisiteRepository from './../../prerequisite/prerequisite.repository.js';
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
            .post('/api/academic/careers/')
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                institution: 1,
                isOfficial: 'hola',
            });

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si un no ADMIN intenta subir una carrera con isOfficial', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
                isOfficial: true,
            });

        expect(res.status).toBe(403);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con "Career"', async () => {
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejor carrera');
        expect(res.body.institution).toBe('La mejor institucion');
        expect(res.body.isOfficial).toBe(false);
        expect(res.body.userId).toBe(user.id);
    });

    it('el usuario es ADMIN, es exitoso y retorna 201 Created y el body con Career', async () => {
        const user = await userRepository.create({
            email: 'test@test.com',
            password: 'testpassword',
            name: 'Juan Test',
            role: 'ADMIN',
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
            .post('/api/academic/careers/')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
                isOfficial: true,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('La mejor carrera');
        expect(res.body.institution).toBe('La mejor institucion');
        expect(res.body.isOfficial).toBe(true);
        expect(res.body.userId).toBe(user.id);
    });
});

describe('GET /:careerId', () => {
    it('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .get('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it('retorna 404 Not Found si no existe una "Career" con ese careerId', async () => {
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
            .get('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(404);
    });

    it('es exitoso y retorna 200 OK y el body con "Career"', async () => {
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
            .get(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(career.id);
        expect(res.body.name).toBe('La mejor carrera');
        expect(res.body.institution).toBe('La mejor institucion');
        expect(res.body.isOfficial).toBe(false);
        expect(res.body.userId).toBe(user.id);
        expect(res.body).toHaveProperty("categories");
    });
});

describe('PATCH /:careerId', () => {
    it('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .patch('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
                isOfficial: false,
            });

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
            .patch('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: '',
                institution: 1,
                isOfficial: 'hola',
            });

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si no tiene ownership sobre la "Career" y no es ADMIN', async () => {
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
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({});

        expect(res.status).toBe(403);
    });

    it('retorna 403 Forbidden si un no ADMIN intenta modificar una carrera a isOfficial', async () => {
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

        const res = await request(app)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                isOfficial: true,
            });

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe una Career con ese careerId', async () => {
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
            .patch('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({});

        expect(res.status).toBe(404);
    });

    it('el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Career', async () => {
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

        const res = await request(app)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123')
            .send({
                name: 'La mejorsisima carrera',
                institution: 'La mejorsisima institucion',
            });

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(career.id);
        expect(res.body.name).toBe('La mejorsisima carrera');
        expect(res.body.institution).toBe('La mejorsisima institucion');
        expect(res.body.isOfficial).toBe(false);
        expect(res.body.userId).toBe(user.id);
    });

    it('el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 200 OK y el body con Career', async () => {
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

        const res = await request(app)
            .patch(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232')
            .send({
                name: 'La mejorsisima carrera',
                institution: 'La mejorsisima institucion',
                isOfficial: true,
            });

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(career.id);
        expect(res.body.name).toBe('La mejorsisima carrera');
        expect(res.body.institution).toBe('La mejorsisima institucion');
        expect(res.body.isOfficial).toBe(true);
        expect(res.body.userId).toBe(user1.id);
    });
});

describe('DELETE /:careerId', () => {
    it('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .delete('/api/academic/careers/esto-no-es-uuid')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it('retorna 403 Forbidden si no tiene ownership sobre Career y no es ADMIN', async () => {
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
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(403);
    });

    it('retorna 404 Not Found si no existe una Career con ese careerId', async () => {
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
                '/api/academic/careers/123e4567-e89b-12d3-a456-426614174000',
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

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
            },
            user.id,
        );

        const res = await request(app)
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(204);
    });

    it('el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 204 No Content', async () => {
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

        const res = await request(app)
            .delete(`/api/academic/careers/${career.id}`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(204);
    });
});

describe("POST /:careerId/clone", () => {
    it('retorna 400 Bad Request si el param careerId está mal formado', async () => {
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
            .post('/api/academic/careers/esto-no-es-uuid/clone')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(400);
    });

    it('retorna 404 Not Found si no existe una "Career" con ese careerId', async () => {
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
            .post('/api/academic/careers/123e4567-e89b-12d3-a456-426614174000/clone')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', 'refreshToken=test123');

        expect(res.status).toBe(404);
    });

    it('es exitoso y retorna 201 Created y el body con Career', async () => {
        const user1 = await userRepository.create({
            email: 'test1@test.com',
            password: 'testpassword1',
            name: 'Juan Test',
        });

        const career = await careerRepository.create(
            {
                name: 'La mejor carrera',
                institution: 'La mejor institucion',
                isOfficial: true,
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

        const subject1 = await subjectRepository.create({
            name: 'La mejor materia 1',
            weeklyMinutes: 2,
            subcategoryId: subcategory.id,
        });

        const subject2 = await subjectRepository.create({
            name: 'La mejor materia 2',
            weeklyMinutes: 2,
            subcategoryId: subcategory.id,
        });

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
            .post(`/api/academic/careers/${career.id}/clone`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .set('Cookie', 'refreshToken=test1232');

        expect(res.status).toBe(201);
        expect(res.body.id).not.toBe(career.id);
        expect(res.body.name).toBe('La mejor carrera');
        expect(res.body.institution).toBe('La mejor institucion');
        expect(res.body.isOfficial).toBe(false);
        expect(res.body.userId).toBe(user2.id);


        const clonedCategory = res.body.categories[0];
        expect(clonedCategory.id).not.toBe(category.id);
        expect(clonedCategory.name).toBe('La mejor categoria');
        expect(clonedCategory.order).toBe(1);
        expect(clonedCategory.careerId).toBe(res.body.id);

        const clonedSubcategory = clonedCategory.subcategories[0];
        expect(clonedSubcategory.id).not.toBe(subcategory.id);
        expect(clonedSubcategory.name).toBe('La mejor subcategoria');
        expect(clonedSubcategory.order).toBe(1);
        expect(clonedSubcategory.categoryId).toBe(clonedCategory.id);

        const clonedSubject1 = clonedSubcategory.subjects[0];
        const clonedSubject2 = clonedSubcategory.subjects[1];
        expect(clonedSubject1.id).not.toBe(subject1.id);
        expect(clonedSubject1.name).toBe('La mejor materia 1');
        expect(clonedSubject1.weeklyMinutes).toBe(2);
        expect(clonedSubject1.subcategoryId).toBe(clonedSubcategory.id);
        expect(clonedSubject2.id).not.toBe(subject2.id);
        expect(clonedSubject2.name).toBe('La mejor materia 2');
        expect(clonedSubject2.weeklyMinutes).toBe(2);
        expect(clonedSubject2.subcategoryId).toBe(clonedSubcategory.id);

        const clonedPrerequisite = clonedSubject1.prerequisites[0];
        expect(clonedPrerequisite.id).not.toBe(prerequisite.id);
        expect(clonedPrerequisite.type).toBe('PASSED');
        expect(clonedPrerequisite.subjectId).toBe(clonedSubject1.id);
        expect(clonedPrerequisite.prerequisiteId).toBe(clonedSubject2.id);
    });
});