import { defineConfig } from "vitest/config";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.test" });
if(!parsed) throw new Error(".env.test es undefined");

export default defineConfig({
    test: {
        setupFiles: ["./src/config/vitest.js"],
        env: {
            JWT_SECRET: parsed.JWT_SECRET,
            DATABASE_URL: parsed.DATABASE_URL
        }
    }
})