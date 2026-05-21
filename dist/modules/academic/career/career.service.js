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
exports.findManyByUserId = findManyByUserId;
exports.findById = findById;
exports.findByIdWithCategories = findByIdWithCategories;
exports.update = update;
exports.remove = remove;
exports.clone = clone;
exports.checkCareerOwnership = checkCareerOwnership;
const errors_js_1 = require("../../../utils/errors.js");
const academic_utils_js_1 = require("../academic.utils.js");
const careerRepository = __importStar(require("./career.repository.js"));
const category_service_js_1 = require("../category/category.service.js");
const database_js_1 = require("../../../config/database.js");
const index_js_1 = require("../../../generated/prisma/index.js");
async function create(career, user, tx = database_js_1.prisma) {
    if (career.isOfficial && !(0, academic_utils_js_1.isAdmin)(user.role))
        throw new errors_js_1.ForbiddenError('User is not ADMIN, cannot set career as official');
    return await careerRepository.create(career, user.id, tx);
}
async function findManyByUserId(userId) {
    return await careerRepository.findManyByUserId(userId);
}
async function findById(careerId) {
    const career = await careerRepository.findById(careerId);
    if (!career)
        throw new errors_js_1.NotFoundError('Career not found');
    return career;
}
async function findByIdWithCategories(careerId, tx = database_js_1.prisma) {
    const career = await careerRepository.findByIdWithCategories(careerId, tx);
    if (!career)
        throw new errors_js_1.NotFoundError('Career not found');
    return career;
}
async function update(careerId, career, role) {
    try {
        if (career.isOfficial && !(0, academic_utils_js_1.isAdmin)(role))
            throw new errors_js_1.ForbiddenError('User is not ADMIN, cannot set career as official');
        return await careerRepository.update(careerId, career);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Career not found');
        }
        throw err;
    }
}
async function remove(careerId) {
    try {
        return await careerRepository.remove(careerId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Career not found');
        }
        throw err;
    }
}
async function clone(careerId, user) {
    const career = await findByIdWithCategories(careerId);
    return await database_js_1.prisma.$transaction(async (tx) => {
        const clonedCareer = await create({ name: career.name, institution: career.institution ?? undefined }, user, tx);
        await Promise.all(career.categories.map((category) => (0, category_service_js_1.clone)(category, clonedCareer.id, tx)));
        return await findByIdWithCategories(clonedCareer.id, tx);
    });
}
async function checkCareerOwnership(careerId, user) {
    const career = await findById(careerId);
    const isOwner = career.userId === user.id;
    if (!isOwner && !(0, academic_utils_js_1.isAdmin)(user.role))
        throw new errors_js_1.ForbiddenError('User does not own the career');
}
