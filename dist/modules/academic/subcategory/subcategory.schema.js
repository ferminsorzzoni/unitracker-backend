"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubcategorySchema = exports.subcategoryParamsSchema = exports.createSubcategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createSubcategorySchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1),
    categoryId: zod_1.default.uuid(),
});
exports.createSubcategorySchema = createSubcategorySchema;
const subcategoryParamsSchema = zod_1.default.object({
    subcategoryId: zod_1.default.uuid(),
});
exports.subcategoryParamsSchema = subcategoryParamsSchema;
const updateSubcategorySchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1).optional(),
    order: zod_1.default.int().positive().optional(),
});
exports.updateSubcategorySchema = updateSubcategorySchema;
