"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
const database_js_1 = require("../../../config/database.js");
async function create(subject, tx = database_js_1.prisma) {
    return await tx.subject.create({
        data: {
            name: subject.name,
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
    return await database_js_1.prisma.subject.update({
        where: {
            id: subjectId,
        },
        data: {
            name: subject.name,
            mark: subject.mark,
            state: subject.state,
            weeklyMinutes: subject.weeklyMinutes,
        },
    });
}
async function remove(subjectId) {
    return await database_js_1.prisma.subject.delete({
        where: {
            id: subjectId,
        },
    });
}
