"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCareerOwnershipFromBody = checkCareerOwnershipFromBody;
exports.checkCategoryOwnershipFromBody = checkCategoryOwnershipFromBody;
exports.checkSubcategoryOwnershipFromBody = checkSubcategoryOwnershipFromBody;
exports.checkSubjectsOwnershipFromBody = checkSubjectsOwnershipFromBody;
const career_service_js_1 = require("../modules/academic/career/career.service.js");
const category_service_js_1 = require("../modules/academic/category/category.service.js");
const subcategory_service_js_1 = require("../modules/academic/subcategory/subcategory.service.js");
const subject_service_js_1 = require("../modules/academic/subject/subject.service.js");
async function checkCareerOwnershipFromBody(req, res, next) {
    try {
        const { careerId } = res.locals.parsedBody;
        await (0, career_service_js_1.checkCareerOwnership)(careerId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function checkCategoryOwnershipFromBody(req, res, next) {
    try {
        const { categoryId } = res.locals.parsedBody;
        await (0, category_service_js_1.checkCategoryOwnership)(categoryId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function checkSubcategoryOwnershipFromBody(req, res, next) {
    try {
        const { subcategoryId } = res.locals.parsedBody;
        await (0, subcategory_service_js_1.checkSubcategoryOwnership)(subcategoryId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function checkSubjectsOwnershipFromBody(req, res, next) {
    try {
        const { subjectId, prerequisiteId } = res.locals.parsedBody;
        await (0, subject_service_js_1.checkSubjectOwnership)(subjectId, req.user);
        await (0, subject_service_js_1.checkSubjectOwnership)(prerequisiteId, req.user);
        return next();
    }
    catch (err) {
        return next(err);
    }
}
