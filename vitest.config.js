import { defineConfig } from "vitest/config";
import { env } from "./src/config/env.js";

export default defineConfig({
    test: {
        setupFiles: ["./src/config/vitest.js"],
        env: {
            JWT_SECRET: env.JWT_SECRET,
            DATABASE_URL: env.TEST_DATABASE_URL
        }
    }
})