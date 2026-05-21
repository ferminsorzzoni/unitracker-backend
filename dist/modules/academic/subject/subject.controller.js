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
exports.deleteSubjectHandler = exports.updateSubjectHandler = exports.createSubjectHandler = void 0;
const subjectService = __importStar(require("./subject.service.js"));
const requireAuth_js_1 = require("../../../middleware/requireAuth.js");
const validate_js_1 = require("../../../middleware/validate.js");
const subject_schema_js_1 = require("./subject.schema.js");
const checkOwnership_js_1 = require("../../../middleware/checkOwnership.js");
const createSubjectHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateBody)(subject_schema_js_1.createSubjectSchema),
    checkOwnership_js_1.checkSubcategoryOwnershipFromBody,
    createSubject,
];
exports.createSubjectHandler = createSubjectHandler;
const updateSubjectHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(subject_schema_js_1.subjectParamsSchema),
    (0, validate_js_1.validateBody)(subject_schema_js_1.updateSubjectSchema),
    checkSubjectOwnership,
    updateSubject,
];
exports.updateSubjectHandler = updateSubjectHandler;
const deleteSubjectHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(subject_schema_js_1.subjectParamsSchema),
    checkSubjectOwnership,
    deleteSubject,
];
exports.deleteSubjectHandler = deleteSubjectHandler;
async function createSubject(req, res, next) {
    try {
        const subject = await subjectService.create(res.locals.parsedBody);
        return res.status(201).json(subject);
    }
    catch (err) {
        return next(err);
    }
}
async function updateSubject(req, res, next) {
    try {
        const { subjectId } = res.locals.parsedParams;
        const subject = await subjectService.update(res.locals.parsedBody, subjectId);
        return res.json(subject);
    }
    catch (err) {
        return next(err);
    }
}
async function deleteSubject(req, res, next) {
    try {
        const { subjectId } = res.locals.parsedParams;
        await subjectService.remove(subjectId);
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
async function checkSubjectOwnership(req, res, next) {
    try {
        const { subjectId } = res.locals.parsedParams;
        await subjectService.checkSubjectOwnership(subjectId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
