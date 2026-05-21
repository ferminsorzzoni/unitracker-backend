"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCareerSchema = exports.careerParamsSchema = exports.createCareerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createCareerSchema = zod_1.default.object({
    name: zod_1.default.string().trim().min(1),
    institution: zod_1.default.string().trim().min(1).optional(),
    isOfficial: zod_1.default.boolean().optional(),
});
exports.createCareerSchema = createCareerSchema;
const careerParamsSchema = zod_1.default.object({
    careerId: zod_1.default.uuid(),
});
exports.careerParamsSchema = careerParamsSchema;
const updateCareerSchema = createCareerSchema.partial();
exports.updateCareerSchema = updateCareerSchema;
