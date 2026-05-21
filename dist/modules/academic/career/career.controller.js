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
exports.cloneCareerHandler = exports.deleteCareerHandler = exports.updateCareerHandler = exports.getMyCareersHandler = exports.getCareerHandler = exports.createCareerHandler = void 0;
const careerService = __importStar(require("./career.service.js"));
const career_schema_js_1 = require("./career.schema.js");
const validate_js_1 = require("../../../middleware/validate.js");
const requireAuth_js_1 = require("../../../middleware/requireAuth.js");
const createCareerHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateBody)(career_schema_js_1.createCareerSchema),
    createCareer,
];
exports.createCareerHandler = createCareerHandler;
const getMyCareersHandler = [requireAuth_js_1.requireAuth, getMyCareers];
exports.getMyCareersHandler = getMyCareersHandler;
const getCareerHandler = [(0, validate_js_1.validateParams)(career_schema_js_1.careerParamsSchema), getCareer];
exports.getCareerHandler = getCareerHandler;
const updateCareerHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(career_schema_js_1.careerParamsSchema),
    (0, validate_js_1.validateBody)(career_schema_js_1.updateCareerSchema),
    checkCareerOwnership,
    updateCareer,
];
exports.updateCareerHandler = updateCareerHandler;
const deleteCareerHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(career_schema_js_1.careerParamsSchema),
    checkCareerOwnership,
    deleteCareer,
];
exports.deleteCareerHandler = deleteCareerHandler;
const cloneCareerHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateParams)(career_schema_js_1.careerParamsSchema),
    cloneCareer,
];
exports.cloneCareerHandler = cloneCareerHandler;
async function createCareer(req, res, next) {
    try {
        const user = req.user;
        const career = await careerService.create(res.locals.parsedBody, user);
        return res.status(201).json(career);
    }
    catch (err) {
        return next(err);
    }
}
async function getMyCareers(req, res, next) {
    try {
        const user = req.user;
        const careers = await careerService.findManyByUserId(user.id);
        return res.json(careers);
    }
    catch (err) {
        return next(err);
    }
}
async function getCareer(req, res, next) {
    try {
        const { careerId } = res.locals.parsedParams;
        const career = await careerService.findByIdWithCategories(careerId);
        return res.json(career);
    }
    catch (err) {
        return next(err);
    }
}
async function updateCareer(req, res, next) {
    try {
        const { role } = req.user;
        const { careerId } = res.locals.parsedParams;
        const career = await careerService.update(careerId, res.locals.parsedBody, role);
        return res.json(career);
    }
    catch (err) {
        return next(err);
    }
}
async function deleteCareer(req, res, next) {
    try {
        const { careerId } = res.locals.parsedParams;
        await careerService.remove(careerId);
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
async function cloneCareer(req, res, next) {
    try {
        const { careerId } = res.locals.parsedParams;
        const user = req.user;
        const career = await careerService.clone(careerId, user);
        return res.status(201).json(career);
    }
    catch (err) {
        return next(err);
    }
}
async function checkCareerOwnership(req, res, next) {
    try {
        const { careerId } = res.locals.parsedParams;
        await careerService.checkCareerOwnership(careerId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
