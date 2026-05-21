"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z
    .object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string(),
    name: zod_1.z.string().min(2),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});
exports.registerSchema = registerSchema;
const loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(1),
});
exports.loginSchema = loginSchema;
const refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.refreshTokenSchema = refreshTokenSchema;
