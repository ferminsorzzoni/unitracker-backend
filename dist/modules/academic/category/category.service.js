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
exports.checkCategoryOwnership = checkCategoryOwnership;
const database_js_1 = require("../../../config/database.js");
const errors_js_1 = require("../../../utils/errors.js");
const career_service_js_1 = require("../career/career.service.js");
const categoryRepository = __importStar(require("./category.repository.js"));
const subcategory_service_js_1 = require("./../subcategory/subcategory.service.js");
const index_js_1 = require("../../../generated/prisma/index.js");
async function create(category, order, tx = database_js_1.prisma) {
    let nextOrder;
    if (!order) {
        nextOrder = (await findMaxOrder(category.careerId, tx)) + 1;
    }
    else {
        nextOrder = order;
    }
    return await categoryRepository.create(category, nextOrder, tx);
}
async function findById(categoryId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category)
        throw new errors_js_1.NotFoundError('Category not found');
    return category;
}
async function update(category, categoryId) {
    try {
        return await categoryRepository.update(category, categoryId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Category not found');
        }
        throw err;
    }
}
async function remove(categoryId) {
    try {
        return await categoryRepository.remove(categoryId);
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new errors_js_1.NotFoundError('Category not found');
        }
        throw err;
    }
}
async function clone(category, careerId, tx = database_js_1.prisma) {
    const clonedCategory = await create({ name: category.name, careerId: careerId }, category.order, tx);
    await Promise.all(category.subcategories.map((subcategory) => (0, subcategory_service_js_1.clone)(subcategory, clonedCategory.id, tx)));
}
async function findMaxOrder(careerId, tx = database_js_1.prisma) {
    const result = await categoryRepository.findMaxOrder(careerId, tx);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}
async function checkCategoryOwnership(categoryId, user) {
    const category = await findById(categoryId);
    await (0, career_service_js_1.checkCareerOwnership)(category.careerId, user);
}
