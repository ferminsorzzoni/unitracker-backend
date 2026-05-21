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
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.createCategoryHandler = void 0;
const requireAuth_js_1 = require("../../../middleware/requireAuth.js");
const validate_js_1 = require("../../../middleware/validate.js");
const category_schema_js_1 = require("./category.schema.js");
const categoryService = __importStar(require("./category.service.js"));
const checkOwnership_js_1 = require("../../../middleware/checkOwnership.js");
const createCategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateBody)(category_schema_js_1.createCategorySchema),
    checkOwnership_js_1.checkCareerOwnershipFromBody,
    createCategory,
];
exports.createCategoryHandler = createCategoryHandler;
const updateCategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(category_schema_js_1.categoryParamsSchema),
    (0, validate_js_1.validateBody)(category_schema_js_1.updateCategorySchema),
    checkCategoryOwnership,
    updateCategory,
];
exports.updateCategoryHandler = updateCategoryHandler;
const deleteCategoryHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(category_schema_js_1.categoryParamsSchema),
    checkCategoryOwnership,
    deleteCategory,
];
exports.deleteCategoryHandler = deleteCategoryHandler;
async function createCategory(req, res, next) {
    try {
        const category = await categoryService.create(res.locals.parsedBody);
        return res.status(201).json(category);
    }
    catch (err) {
        return next(err);
    }
}
async function updateCategory(req, res, next) {
    try {
        const { categoryId } = res.locals.parsedParams;
        const category = await categoryService.update(res.locals.parsedBody, categoryId);
        return res.json(category);
    }
    catch (err) {
        return next(err);
    }
}
async function deleteCategory(req, res, next) {
    try {
        const { categoryId } = res.locals.parsedParams;
        await categoryService.remove(categoryId);
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
async function checkCategoryOwnership(req, res, next) {
    try {
        const { categoryId } = res.locals.parsedParams;
        await categoryService.checkCategoryOwnership(categoryId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
