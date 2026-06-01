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
exports.findMaxOrder = findMaxOrder;
exports.checkSubcategoryOwnership = checkSubcategoryOwnership;
const database_js_1 = require("../../../config/database.js");
const errors_js_1 = require("../../../utils/errors.js");
const category_service_js_1 = require("../category/category.service.js");
const subcategoryRepository = __importStar(require("./subcategory.repository.js"));
const subject_service_js_1 = require("../subject/subject.service.js");
const prerequisite_service_js_1 = require("../prerequisite/prerequisite.service.js");
const index_js_1 = require("../../../generated/prisma/index.js");
async function create(subcategory, order, tx = database_js_1.prisma) {
    let nextOrder;
    if (!order) {
        nextOrder = (await findMaxOrder(subcategory.categoryId)) + 1;
    }
    else {
        nextOrder = order;
    }
    return await subcategoryRepository.create(subcategory, nextOrder, tx);
}
async function findById(subcategoryId) {
    const subcategory = await subcategoryRepository.findById(subcategoryId);
    if (!subcategory)
        throw new errors_js_1.NotFoundError('Subcategory not found');
    return subcategory;
}
async function update(subcategory, subcategoryId) {
    try {
        return await subcategoryRepository.update(subcategory, subcategoryId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Subcategory not found');
        }
        throw err;
    }
}
async function remove(subcategoryId) {
    try {
        return await subcategoryRepository.remove(subcategoryId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Subcategory not found');
        }
        throw err;
    }
}
async function clone(subcategory, categoryId, tx = database_js_1.prisma) {
    const clonedSubcategory = await create({ name: subcategory.name, categoryId: categoryId }, subcategory.order, tx);
    const subjectIdMap = new Map();
    await Promise.all(subcategory.subjects.map(async (subject) => {
        const clonedSubject = await (0, subject_service_js_1.clone)(subject, clonedSubcategory.id, tx);
        subjectIdMap.set(subject.id, clonedSubject.id);
        return clonedSubject;
    }));
    await Promise.all(subcategory.subjects.map((subject) => (0, prerequisite_service_js_1.clone)(subject.prerequisites, subjectIdMap, tx)));
}
async function findMaxOrder(categoryId) {
    const result = await subcategoryRepository.findMaxOrder(categoryId);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}
async function checkSubcategoryOwnership(subcategoryId, user) {
    const subcategory = await findById(subcategoryId);
    await (0, category_service_js_1.checkCategoryOwnership)(subcategory.categoryId, user);
}
