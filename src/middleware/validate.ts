import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors.js';
import { z } from 'zod';

function validateBody(schema: z.ZodType) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.body);
        if (!result.success) return next(new BadRequestError(result.error.message));
        res.locals.parsedBody = result.data;
        return next();
    };
}

function validateCookies(schema: z.ZodType) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.cookies);
        if (!result.success) return next(new BadRequestError(result.error.message));
        res.locals.parsedCookies = result.data;
        return next();
    };
}

function validateParams(schema: z.ZodType) {
    return function(req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.params);
        if(!result.success) return next(new BadRequestError(result.error.message));
        res.locals.parsedParams = result.data;
        return next();
    }
}

export { validateBody, validateCookies, validateParams };
