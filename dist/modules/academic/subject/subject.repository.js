"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
exports.findMaxOrder = findMaxOrder;
const database_js_1 = require("../../../config/database.js");
async function create(subject, order, tx = database_js_1.prisma) {
    return await tx.subject.create({
        data: {
            name: subject.name,
            order: order,
            subcategoryId: subject.subcategoryId,
            weeklyMinutes: subject.weeklyMinutes,
        },
    });
}
async function findById(subjectId) {
    return await database_js_1.prisma.subject.findUnique({
        where: {
            id: subjectId,
        },
    });
}
async function update(subject, subjectId) {
    return await database_js_1.prisma.$transaction(async (tx) => {
        const updatedSubject = await tx.subject.update({
            where: {
                id: subjectId,
            },
            data: {
                name: subject.name,
                mark: subject.mark,
                state: subject.state,
                order: subject.order,
                weeklyMinutes: subject.weeklyMinutes,
            },
        });
        if (subject.order) {
            await tx.subject.updateMany({
                where: {
                    subcategoryId: updatedSubject.subcategoryId,
                    order: { gte: subject.order },
                    NOT: { id: subjectId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }
        return updatedSubject;
    });
}
async function remove(subjectId) {
    return await database_js_1.prisma.subject.delete({
        where: {
            id: subjectId,
        },
    });
}
async function findMaxOrder(subcategoryId) {
    return await database_js_1.prisma.subject.aggregate({
        where: {
            subcategoryId: subcategoryId,
        },
        _max: {
            order: true,
        },
    });
}
