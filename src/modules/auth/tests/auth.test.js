import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./../../../app.js";
import { prisma } from "./../../../config/database.js";
import { createHashedToken, createUser } from "./../auth.repository.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

describe("/refresh", () => {
    it("retorna 400 Bad Request si la cookie \"refreshToken\" no existe", async () => {
        const res = await request(app)
            .post("/api/auth/refresh");

        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si la cookie \"refreshToken\" está mal formada", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=");

        expect(res.status).toBe(400);
    });

    it("retorna 401 Unauthorized si no existe el refreshToken en la DB", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=abc123");

        expect(res.status).toBe(401);
    });

    it("retorna 401 Unauthorized si el refreshToken expiró", async () => {
        const user = await createUser({ email: "test@test.com", password: "test", name: "Juan Test" });
        const hashedToken = crypto.createHash("sha256").update("test123").digest("hex");
        await createHashedToken(user.id, hashedToken, new Date(Date.now() - 1000));

        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=test123");

        expect(res.status).toBe(401);
    });

    it("es exitoso y retorna 200 OK y el body con \"accessToken\"", async () => {
        const user = await createUser({ email: "test@test.com", password: "testpassword", name: "Juan Test" });
        const hashedToken = crypto.createHash("sha256").update("test123").digest("hex");
        await createHashedToken(user.id, hashedToken, new Date(Date.now() + 100000));

        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=test123");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
});

describe("/register", () => {
    it("retorna 400 Bad Request si el body no existe", async () => {
        const res = await request(app)
            .post("/api/auth/register");

        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si el body está mal formado", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "testtest", password: "test", name: "t"});
        
        expect(res.status).toBe(400);
    });

    it("retorna 409 Conflict si el email ya está registrado", async () => {
        await createUser({ email: "test@test.com", password: "test", name: "Juan Test" });

        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.com", password: "testpassword", name: "Juan Test" });
        
        expect(res.status).toBe(409);
    });

    it("es exitoso y retorna 201 Created, la cookie \"refreshToken\" y el body con \"accessToken\"", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.com", password: "testpassword", name: "Juan Test" });
        
        expect(res.status).toBe(201);
        expect(res.headers["set-cookie"][0]).toContain("refreshToken");
        expect(res.body).toHaveProperty("accessToken");
    });
});

describe("/login", () => {
    it("retorna 400 Bad Request si el body no existe", async () => {
        const res = await request(app)
            .post("/api/auth/login");
        
        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si el body está mal formado", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "testtest", password: "test" });

        expect(res.status).toBe(400);
    });

    it("retorna 401 Unauthorized si las credenciales no son correctas", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "passwordtest" });

        expect(res.status).toBe(401);
    });

    it("es exitoso y retorna 200 OK, la cookie \"refreshToken\" y el body con \"accessToken\"", async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await createUser({ email: "test@test.com", password: hashedPassword, name: "Juan Test" });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "testpassword" });

        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"][0]).toContain("refreshToken");
        expect(res.body).toHaveProperty("accessToken");
    });
});

describe("/logout", () => {
    it("retorna 400 Bad Request si la cookie \"refreshToken\" no existe", async () => {
        const res = await request(app)
            .post("/api/auth/logout");

        expect(res.status).toBe(400);
    });

    it("retorna 400 Bad Request si la cookie \"refreshToken\" esta mal formada", async () => {
        const res = await request(app)
            .post("/api/auth/logout")
            .set("Cookie", "refreshToken=");
        
        expect(res.status).toBe(400);
    });

    it("es exitoso y retorna 204 No Content", async () => {
        const user = await createUser({ email: "test@test.com", password: "testpassword", name: "Juan Test" });
        const hashedToken = crypto.createHash("sha256").update("test123").digest("hex");
        await createHashedToken(user.id, hashedToken, new Date(Date.now() + 100000));

        const res = await request(app)
            .post("/api/auth/logout")
            .set("Cookie", "refreshToken=test123");
        
        expect(res.status).toBe(204);
    });
});