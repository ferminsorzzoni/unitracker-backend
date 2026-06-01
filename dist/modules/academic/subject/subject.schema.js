"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubjectSchema = exports.subjectParamsSchema = exports.createSubjectSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createSubjectSchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1),
    weeklyMinutes: zod_1.default.int().positive().optional(),
    subcategoryId: zod_1.default.uuid(),
});
exports.createSubjectSchema = createSubjectSchema;
const subjectParamsSchema = zod_1.default.object({
    subjectId: zod_1.default.uuid(),
});
exports.subjectParamsSchema = subjectParamsSchema;
const updateSubjectSchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1).optional(),
    mark: zod_1.default.int().min(0).max(10).optional(),
    state: zod_1.default
        .enum(['PENDING', 'IN_PROGRESS', 'REGULARIZED', 'FAILED', 'PASSED'])
        .optional(),
    order: zod_1.default.int().positive().optional(),
    weeklyMinutes: zod_1.default.int().positive().optional(),
});
exports.updateSubjectSchema = updateSubjectSchema;
