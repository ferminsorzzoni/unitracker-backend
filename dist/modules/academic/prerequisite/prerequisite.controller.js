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
exports.deletePrerequisiteHandler = exports.createPrerequisiteHandler = void 0;
const prerequisiteService = __importStar(require("./prerequisite.service.js"));
const requireAuth_js_1 = require("../../../middleware/requireAuth.js");
const validate_js_1 = require("../../../middleware/validate.js");
const prerequisite_schema_js_1 = require("./prerequisite.schema.js");
const checkOwnership_js_1 = require("../../../middleware/checkOwnership.js");
const createPrerequisiteHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateBody)(prerequisite_schema_js_1.createPrerequisiteSchema),
    checkOwnership_js_1.checkSubjectsOwnershipFromBody,
    createPrerequisite,
];
exports.createPrerequisiteHandler = createPrerequisiteHandler;
const deletePrerequisiteHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(prerequisite_schema_js_1.prerequisiteParamsSchema),
    checkPrerequisiteOwnership,
    deletePrerequisite,
];
exports.deletePrerequisiteHandler = deletePrerequisiteHandler;
async function createPrerequisite(req, res, next) {
    try {
        const prerequisite = await prerequisiteService.create(res.locals.parsedBody);
        return res.status(201).json(prerequisite);
    }
    catch (err) {
        return next(err);
    }
}
async function deletePrerequisite(req, res, next) {
    try {
        const { prerequisiteId } = res.locals.parsedParams;
        await prerequisiteService.remove(prerequisiteId);
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
async function checkPrerequisiteOwnership(req, res, next) {
    try {
        const { prerequisiteId } = res.locals.parsedParams;
        await prerequisiteService.checkPrerequisiteOwnership(prerequisiteId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
