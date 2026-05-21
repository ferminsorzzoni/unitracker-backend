"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByToken = findByToken;
exports.removeExpired = removeExpired;
exports.removeByToken = removeByToken;
exports.create = create;
const database_js_1 = require("../../config/database.js");
async function findByToken(hashedToken) {
    return await database_js_1.prisma.refreshToken.findUnique({
        where: { token: hashedToken },
    });
}
async function removeExpired(userId) {
    return await database_js_1.prisma.refreshToken.deleteMany({
        where: { userId: userId, expiresAt: { lt: new Date() } },
    });
}
async function removeByToken(hashedToken) {
    return await database_js_1.prisma.refreshToken.delete({
        where: {
            token: hashedToken,
        },
    });
}
async function create(userId, hashedToken, expiresAt) {
    return await database_js_1.prisma.refreshToken.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt,
        },
    });
}
