import { afterAll, beforeEach } from "vitest";
import { prisma } from "./database.js";

beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});