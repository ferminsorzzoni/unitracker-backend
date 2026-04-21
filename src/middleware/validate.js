import { BadRequestError } from "../utils/errors.js";

function validateBody(schema) {
    return function(req, res, next) {
        const result = schema.safeParse(req.body);
        if(!result.success) next(new BadRequestError(result.error.errors));
        next();
    }
}

function validateCookies(schema) {
    return function(req, res, next) {
        const result = schema.safeParse(req.cookies);
        if(!result.success) next(new BadRequestError(result.error.errors));
        next();
    }
}

export { validateBody, validateCookies };