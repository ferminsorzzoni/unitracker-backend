"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_js_1 = require("./database.js");
(0, vitest_1.beforeEach)(async () => {
    await database_js_1.prisma.refreshToken.deleteMany();
    await database_js_1.prisma.career.deleteMany();
    await database_js_1.prisma.user.deleteMany();
});
(0, vitest_1.afterAll)(async () => {
    await database_js_1.prisma.$disconnect();
});
