import { defineConfig } from "vitest/config";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.test" });

export default defineConfig({
    test: {
        setupFiles: ["./src/config/vitest.js"],
        env: {
            JWT_SECRET: parsed.JWT_SECRET,
            DATABASE_URL: parsed.DATABASE_URL
        }
    }
})