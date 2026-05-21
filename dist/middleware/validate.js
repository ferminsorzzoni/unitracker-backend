"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateCookies = validateCookies;
exports.validateParams = validateParams;
const errors_js_1 = require("../utils/errors.js");
function validateBody(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);
        if (!result.success)
            return next(new errors_js_1.BadRequestError(result.error.message));
        res.locals.parsedBody = result.data;
        return next();
    };
}
function validateCookies(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.cookies);
        if (!result.success)
            return next(new errors_js_1.BadRequestError(result.error.message));
        res.locals.parsedCookies = result.data;
        return next();
    };
}
function validateParams(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.params);
        if (!result.success)
            return next(new errors_js_1.BadRequestError(result.error.message));
        res.locals.parsedParams = result.data;
        return next();
    };
}
