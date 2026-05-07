import { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../../middleware/requireAuth.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import {
    createSubcategorySchema,
    subcategoryParamsSchema,
    updateSubcategorySchema,
} from './subcategory.schema.js';
import * as subcategoryService from './subcategory.service.js';
import { checkCategoryOwnershipFromBody } from '../../../middleware/checkOwnership.js';

const createSubcategoryHandler = [
    requireAuth,
    validateBody(createSubcategorySchema),
    checkCategoryOwnershipFromBody,
    createSubcategory,
];
const updateSubcategoryHandler = [
    requireAuth,
    validateParams(subcategoryParamsSchema),
    validateBody(updateSubcategorySchema),
    checkSubcategoryOwnership,
    updateSubcategory,
];
const deleteSubcategoryHandler = [
    requireAuth,
    validateParams(subcategoryParamsSchema),
    checkSubcategoryOwnership,
    deleteSubcategory,
];

async function createSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const subcategory = await subcategoryService.create(
            res.locals.parsedBody,
        );

        return res.status(201).json(subcategory);
    } catch (err) {
        return next(err);
    }
}

async function updateSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        const subcategory = await subcategoryService.update(
            res.locals.parsedBody,
            subcategoryId,
        );

        return res.json(subcategory);
    } catch (err) {
        return next(err);
    }
}

async function deleteSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        await subcategoryService.remove(subcategoryId);

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function checkSubcategoryOwnership(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { subcategoryId } = res.locals.parsedParams;
        await subcategoryService.checkSubcategoryOwnership(
            subcategoryId,
            req.user!,
        );
        return next();
    } catch (err) {
        return next(err);
    }
}

export {
    createSubcategoryHandler,
    updateSubcategoryHandler,
    deleteSubcategoryHandler,
};
