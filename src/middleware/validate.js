import { BadRequestError } from "../utils/errors.js";

function validate(schema) {
    return function(req, res, next) {
        const result = schema.safeParse(req.body);
        if(!result.success) next(new BadRequestError(result.error.errors));
        next();
    }
}

export { validate };