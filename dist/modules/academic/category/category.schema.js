"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.categoryParamsSchema = exports.createCategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createCategorySchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1),
    careerId: zod_1.default.uuid(),
});
exports.createCategorySchema = createCategorySchema;
const categoryParamsSchema = zod_1.default.object({
    categoryId: zod_1.default.uuid(),
});
exports.categoryParamsSchema = categoryParamsSchema;
const updateCategorySchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1).optional(),
    order: zod_1.default.int().positive().optional(),
});
exports.updateCategorySchema = updateCategorySchema;
