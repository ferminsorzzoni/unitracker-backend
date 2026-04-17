import "dotenv/config";

export const env = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
}