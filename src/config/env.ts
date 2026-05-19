import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string(),
    JWT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    BASE_URL: z.string(),
    FRONTEND_URL: z.string(),
});

export const env = envSchema.parse(process.env);
