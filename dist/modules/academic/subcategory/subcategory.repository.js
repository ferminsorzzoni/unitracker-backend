"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
exports.findMaxOrder = findMaxOrder;
const database_js_1 = require("../../../config/database.js");
async function create(subcategory, order, tx = database_js_1.prisma) {
    return await tx.subcategory.create({
        data: {
            name: subcategory.name,
            order: order,
            categoryId: subcategory.categoryId,
        },
    });
}
async function findById(subcategoryId) {
    return await database_js_1.prisma.subcategory.findUnique({
        where: {
            id: subcategoryId,
        },
    });
}
async function update(subcategory, subcategoryId) {
    return await database_js_1.prisma.$transaction(async (tx) => {
        const updatedSubcategory = await tx.subcategory.update({
            where: {
                id: subcategoryId,
            },
            data: {
                name: subcategory.name,
                order: subcategory.order,
            },
        });
        if (subcategory.order) {
            await tx.subcategory.updateMany({
                where: {
                    categoryId: updatedSubcategory.categoryId,
                    order: { gte: subcategory.order },
                    NOT: { id: subcategoryId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }
        return updatedSubcategory;
    });
}
async function remove(subcategoryId) {
    return await database_js_1.prisma.subcategory.delete({
        where: {
            id: subcategoryId,
        },
    });
}
async function findMaxOrder(categoryId) {
    return await database_js_1.prisma.subcategory.aggregate({
        where: {
            categoryId: categoryId,
        },
        _max: {
            order: true,
        },
    });
}
