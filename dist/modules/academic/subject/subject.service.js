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
exports.update = update;
exports.remove = remove;
exports.clone = clone;
exports.checkSubjectOwnership = checkSubjectOwnership;
const database_js_1 = require("../../../config/database.js");
const index_js_1 = require("../../../generated/prisma/index.js");
const errors_js_1 = require("../../../utils/errors.js");
const subcategory_service_js_1 = require("../subcategory/subcategory.service.js");
const subjectRepository = __importStar(require("./subject.repository.js"));
async function create(subject, tx = database_js_1.prisma) {
    return await subjectRepository.create(subject, tx);
}
async function findById(subjectId) {
    const subject = await subjectRepository.findById(subjectId);
    if (!subject)
        throw new errors_js_1.NotFoundError('Subject not found');
    return subject;
}
async function update(subject, subjectId) {
    try {
        return await subjectRepository.update(subject, subjectId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Subject not found');
        }
        throw err;
    }
}
async function remove(subjectId) {
    try {
        return await subjectRepository.remove(subjectId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Subject not found');
        }
        throw err;
    }
}
async function clone(subject, subcategoryId, tx = database_js_1.prisma) {
    return await create({
        name: subject.name,
        subcategoryId: subcategoryId,
        weeklyMinutes: subject.weeklyMinutes ?? undefined,
    }, tx);
}
async function checkSubjectOwnership(subjectId, user) {
    const subject = await findById(subjectId);
    await (0, subcategory_service_js_1.checkSubcategoryOwnership)(subject.subcategoryId, user);
}
