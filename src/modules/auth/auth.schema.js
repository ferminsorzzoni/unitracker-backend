import { z } from "zod";

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(2)
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
});


export { registerSchema, loginSchema, refreshTokenSchema };