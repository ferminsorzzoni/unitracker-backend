import { z } from 'zod';

const registerSchema = z
    .object({
        email: z.email(),
        password: z.string().min(8),
        confirmPassword: z.string(),
        name: z.string().min(2),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1),
});

export { registerSchema, loginSchema, refreshTokenSchema };
