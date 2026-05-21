"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.remove = remove;
exports.clone = clone;
exports.checkPrerequisiteOwnership = checkPrerequisiteOwnership;
const prerequisiteRepository = __importStar(require("./prerequisite.repository.js"));
const errors_js_1 = require("../../../utils/errors.js");
const subject_service_js_1 = require("../subject/subject.service.js");
const database_js_1 = require("../../../config/database.js");
const index_js_1 = require("../../../generated/prisma/index.js");
async function create(prerequisite, tx = database_js_1.prisma) {
    return await prerequisiteRepository.create(prerequisite, tx);
}
async function findById(prerequisiteId) {
    const prerequisite = await prerequisiteRepository.findById(prerequisiteId);
    if (!prerequisite)
        throw new errors_js_1.NotFoundError('Prerequisite not found');
    return prerequisite;
}
async function remove(prerequisiteId) {
    try {
        return await prerequisiteRepository.remove(prerequisiteId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Prerequisite not found');
        }
        throw err;
    }
}
async function clone(prerequisites, subjectIdMap, tx = database_js_1.prisma) {
    prerequisites.forEach(async (prerequisite) => {
        const newSubjectId = subjectIdMap.get(prerequisite.subjectId);
        const newPrerequisiteId = subjectIdMap.get(prerequisite.prerequisiteId);
        if (!newSubjectId || !newPrerequisiteId)
            throw new errors_js_1.NotFoundError('Prerequisite not found');
        await create({
            subjectId: newSubjectId,
            prerequisiteId: newPrerequisiteId,
            type: prerequisite.type,
        }, tx);
    });
}
async function checkPrerequisiteOwnership(prerequisiteId, user) {
    const prerequisite = await findById(prerequisiteId);
    await (0, subject_service_js_1.checkSubjectOwnership)(prerequisite.subjectId, user);
    await (0, subject_service_js_1.checkSubjectOwnership)(prerequisite.prerequisiteId, user);
}
