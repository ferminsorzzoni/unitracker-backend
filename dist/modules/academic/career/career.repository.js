"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findManyByUserId = findManyByUserId;
exports.findById = findById;
exports.findByIdWithCategories = findByIdWithCategories;
exports.update = update;
exports.remove = remove;
const database_js_1 = require("../../../config/database.js");
async function create(career, userId, tx = database_js_1.prisma) {
    return await tx.career.create({
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial,
            userId,
        },
    });
}
async function findManyByUserId(userId) {
    return await database_js_1.prisma.career.findMany({
        where: { userId: userId },
        orderBy: { name: 'asc' },
    });
}
async function findById(careerId) {
    return await database_js_1.prisma.career.findUnique({
        where: {
            id: careerId,
        },
    });
}
async function findByIdWithCategories(careerId, tx = database_js_1.prisma) {
    return await tx.career.findUnique({
        where: {
            id: careerId,
        },
        include: {
            categories: {
                include: {
                    subcategories: {
                        include: {
                            subjects: {
                                include: {
                                    prerequisites: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}
async function update(careerId, career) {
    return await database_js_1.prisma.career.update({
        where: {
            id: careerId,
        },
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial,
        },
    });
}
async function remove(careerId) {
    return await database_js_1.prisma.career.delete({
        where: {
            id: careerId,
        },
    });
}
