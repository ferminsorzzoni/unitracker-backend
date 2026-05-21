"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
exports.findMaxOrder = findMaxOrder;
const database_js_1 = require("../../../config/database.js");
async function create(category, order, tx = database_js_1.prisma) {
    return await tx.category.create({
        data: {
            name: category.name,
            order: order,
            careerId: category.careerId,
        },
    });
}
async function findById(categoryId) {
    return await database_js_1.prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
}
async function update(category, categoryId) {
    return await database_js_1.prisma.$transaction(async (tx) => {
        const updatedCategory = await tx.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: category.name,
                order: category.order,
            },
        });
        if (category.order) {
            await tx.category.updateMany({
                where: {
                    careerId: updatedCategory.careerId,
                    order: { gte: category.order },
                    NOT: { id: categoryId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }
        return updatedCategory;
    });
}
async function remove(categoryId) {
    return await database_js_1.prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
}
async function findMaxOrder(careerId, tx = database_js_1.prisma) {
    return await tx.category.aggregate({
        where: {
            careerId: careerId,
        },
        _max: {
            order: true,
        },
    });
}
