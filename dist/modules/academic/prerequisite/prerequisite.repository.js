"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.remove = remove;
const database_js_1 = require("../../../config/database.js");
async function create(prerequisite, tx = database_js_1.prisma) {
    return await tx.prerequisite.create({
        data: {
            type: prerequisite.type,
            subjectId: prerequisite.subjectId,
            prerequisiteId: prerequisite.prerequisiteId,
        },
    });
}
async function findById(prerequisiteId) {
    return await database_js_1.prisma.prerequisite.findUnique({
        where: {
            id: prerequisiteId,
        },
    });
}
async function remove(prerequisiteId) {
    return await database_js_1.prisma.prerequisite.delete({
        where: {
            id: prerequisiteId,
        },
    });
}
