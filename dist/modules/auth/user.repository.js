"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = findById;
exports.findByGoogleId = findByGoogleId;
exports.findByEmail = findByEmail;
exports.create = create;
const database_js_1 = require("../../config/database.js");
async function findById(id) {
    return await database_js_1.prisma.user.findUnique({
        where: { id: id },
    });
}
async function findByGoogleId(googleId) {
    return await database_js_1.prisma.user.findUnique({
        where: { googleId: googleId },
    });
}
async function findByEmail(email) {
    return await database_js_1.prisma.user.findUnique({
        where: { email },
    });
}
async function create({ email, password, name, googleId, role, }) {
    return database_js_1.prisma.user.create({
        data: {
            email,
            password,
            name,
            googleId,
            role,
        },
    });
    /*
    Para cuando implemente la sync de cuentas
    if(existing && existing.password && password) throw new ConflictError("Email already registered");
    
    if(googleId) {
        existing = await prisma.user.upsert({
            where: { email },
            update: { googleId: googleId },
            create: { email, name, googleId }
        })
    }

    if(password) {
        existing = await prisma.user.upsert({
            where: { email },
            update: { password: password },
            create: { email, name, password }
        })
    }

    return existing;
    */
}
