import { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../../middleware/requireAuth.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import {
    categoryParamsSchema,
    createCategorySchema,
    updateCategorySchema,
} from './category.schema.js';
import * as categoryService from './category.service.js';
import { checkCareerOwnershipFromBody } from '../../../middleware/checkOwnership.js';

const createCategoryHandler = [
    requireAuth,
    validateBody(createCategorySchema),
    checkCareerOwnershipFromBody,
    createCategory,
];
const updateCategoryHandler = [
    requireAuth,
    validateParams(categoryParamsSchema),
    validateBody(updateCategorySchema),
    checkCategoryOwnership,
    updateCategory,
];
const deleteCategoryHandler = [
    requireAuth,
    validateParams(categoryParamsSchema),
    checkCategoryOwnership,
    deleteCategory,
];

async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await categoryService.create(res.locals.parsedBody);

        return res.status(201).json(category);
    } catch (err) {
        return next(err);
    }
}

async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId } = res.locals.parsedParams;
        const category = await categoryService.update(
            res.locals.parsedBody,
            categoryId,
        );

        return res.json(category);
    } catch (err) {
        return next(err);
    }
}

async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId } = res.locals.parsedParams;
        await categoryService.remove(categoryId);

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function checkCategoryOwnership(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { categoryId } = res.locals.parsedParams;
        await categoryService.checkCategoryOwnership(categoryId, req.user!);
        return next();
    } catch (err) {
        return next(err);
    }
}

export { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler };
