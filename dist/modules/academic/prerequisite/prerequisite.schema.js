"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prerequisiteParamsSchema = exports.createPrerequisiteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createPrerequisiteSchema = zod_1.default.object({
    type: zod_1.default.enum(['ATTEMPTED', 'REGULARIZED', 'PASSED']),
    subjectId: zod_1.default.uuid(),
    prerequisiteId: zod_1.default.uuid(),
});
exports.createPrerequisiteSchema = createPrerequisiteSchema;
const prerequisiteParamsSchema = zod_1.default.object({
    prerequisiteId: zod_1.default.uuid(),
});
exports.prerequisiteParamsSchema = prerequisiteParamsSchema;
