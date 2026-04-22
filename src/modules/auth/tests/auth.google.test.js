import { vi, describe, it, expect } from "vitest";
import passport from "passport";
import request from "supertest";

vi.mock("passport", async () => {
    const actual = await vi.importActual("passport");
    return {
        ...actual,
        authenticate: vi.fn((strategy, options) => (req, res, next) => {
            req.user = { user: { id: 1, email: "test@test.com" }, created: false };
            next();
        })
    };
});

import app from "../../../app.js";

describe("/google/callback", () => {
    it.skip("es exitoso y retorna 200 OK si se loguea el usuario", async () => {
        const res = await request(app)
            .get("/api/auth/google/callback");

        expect(res.status).toBe(200);
    });

    it.skip("es exitoso y retorna 201 Created si se crea el usuario", async () => {
        vi.mocked(passport.authenticate).mockImplementationOnce(
            (strategy, options) => (req, res, next) => {
                req.user = { user: { id: 1, email: "test@test.com" }, created: true };
                next();
            }
        );

        const res = await request(app)
            .get("/api/auth/google/callback");

        expect(res.status).toBe(201);
    });
});