"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string(),
    DATABASE_URL: zod_1.z.string(),
    BASE_URL: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string(),
    NODE_ENV: zod_1.z.string(),
});
exports.env = envSchema.parse(process.env);
