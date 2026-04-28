import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './../../../../app.js';
/*import bcrypt from 'bcrypt';
import crypto from 'crypto';*/

describe("POST /", () => {
    it('retorna 400 Bad Request si el body no existe', async () => {
        const res = await request(app).post('/api/career/');

        expect(res.status).toBe(400);
    });

    it('retorna 400 Bad Request si el body está mal formado', async () => {
        const res = await request(app).post('/api/career/').send({
            name: "",
            institution: 1,
            isOfficial: "hola",
        });

        expect(res.status).toBe(400);
    });

    it("retorna 403 Forbidden si un no ADMIN intenta subir una carrera con isOfficial", async () => {

    });

    it("el usuario no es ADMIN, es exitoso y retorna 201 Created y el body con \"Career\"", async () => {

    });

    it("el usuario es ADMIN, es exitoso y retorna 201 Created y el body con Career", async () => {

    });
});

describe("GET /:careerId", () => {
    it("retorna 400 Bad Request si no tiene params", async () => {

    });

    it("retorna 400 Bad Request si el param careerId está mal formado", async () => {

    });

    it("retorna 404 Not Found si no existe una \"Career\" con ese careerId", async () => {

    });

    it("es exitoso y retorna 200 OK y el body con \"Career\"", async () => {

    });
});

describe("PATCH /:careerId", () => {
    it("retorna 400 Bad Request si no tiene params", async () => {

    });

    it("retorna 400 Bad Request si el param careerId está mal formado", async () => {

    });

    it("retorna 400 Bad Request si el body no existe", async () => {

    });

    it("retorna 400 Bad Request si el body está mal formado", async () => {

    });

    it("retorna 403 Forbidden si no tiene ownership sobre la \"Career\" y no es ADMIN", async () => {

    });

    it("retorna 403 Forbidden si un no ADMIN intenta modificar una carrera a isOfficial", async () => {

    });

    it("retorna 404 Not Found si no existe una Career con ese careerId", async () => {

    });

    it("el usuario no es ADMIN, es exitoso y retorna 200 OK y el body con Career", async () => {

    });

    it("el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 200 OK y el body con Career", async () => {

    });
});

describe("DELETE /:careerId", () => {
    it("retorna 400 Bad Request si no tiene params", async () => {

    });

    it("retorna 400 Bad Request si el param careerId está mal formado", async () => {

    });

    it("retorna 403 Forbidden si no tiene ownership sobre Career y no es ADMIN", async () => {

    });

    it("retorna 404 Not Found si no existe una Career con ese careerId", async () => {

    });

    it("el usuario no es ADMIN, es exitoso y retorna 204 No Content", async () => {

    });

    it("el usuario es ADMIN y no tiene ownership sobre Career, es exitoso y retorna 204 No Content", async () => {

    });
});