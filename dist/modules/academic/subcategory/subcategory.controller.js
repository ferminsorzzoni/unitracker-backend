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
exports.deleteSubcategoryHandler = exports.updateSubcategoryHandler = exports.createSubcategoryHandler = void 0;
const requireAuth_js_1 = require("../../../middleware/requireAuth.js");
const validate_js_1 = require("../../../middleware/validate.js");
const subcategory_schema_js_1 = require("./subcategory.schema.js");
const subcategoryService = __importStar(require("./subcategory.service.js"));
const checkOwnership_js_1 = require("../../../middleware/checkOwnership.js");
const createSubcategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateBody)(subcategory_schema_js_1.createSubcategorySchema),
    checkOwnership_js_1.checkCategoryOwnershipFromBody,
    createSubcategory,
];
exports.createSubcategoryHandler = createSubcategoryHandler;
const updateSubcategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(subcategory_schema_js_1.subcategoryParamsSchema),
    (0, validate_js_1.validateBody)(subcategory_schema_js_1.updateSubcategorySchema),
    checkSubcategoryOwnership,
    updateSubcategory,
];
exports.updateSubcategoryHandler = updateSubcategoryHandler;
const deleteSubcategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(subcategory_schema_js_1.subcategoryParamsSchema),
    checkSubcategoryOwnership,
    deleteSubcategory,
];
exports.deleteSubcategoryHandler = deleteSubcategoryHandler;
async function createSubcategory(req, res, next) {
    try {
        const subcategory = await subcategoryService.create(res.locals.parsedBody);
        return res.status(201).json(subcategory);
    }
    catch (err) {
        return next(err);
    }
}
async function updateSubcategory(req, res, next) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        const subcategory = await subcategoryService.update(res.locals.parsedBody, subcategoryId);
        return res.json(subcategory);
    }
    catch (err) {
        return next(err);
    }
}
async function deleteSubcategory(req, res, next) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        await subcategoryService.remove(subcategoryId);
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
async function checkSubcategoryOwnership(req, res, next) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        await subcategoryService.checkSubcategoryOwnership(subcategoryId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
