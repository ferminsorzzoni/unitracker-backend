import { Request, Response, NextFunction } from 'express';
import * as prerequisiteService from './prerequisite.service.js';
import { requireAuth } from '../../../middleware/requireAuth.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import {
    createPrerequisiteSchema,
    prerequisiteParamsSchema,
} from './prerequisite.schema.js';
import { checkSubjectsOwnershipFromBody } from '../../../middleware/checkOwnership.js';

const createPrerequisiteHandler = [
    requireAuth,
    validateBody(createPrerequisiteSchema),
    checkSubjectsOwnershipFromBody,
    createPrerequisite,
];
const deletePrerequisiteHandler = [
    requireAuth,
    validateParams(prerequisiteParamsSchema),
    checkPrerequisiteOwnership,
    deletePrerequisite,
];

async function createPrerequisite(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const prerequisite = await prerequisiteService.create(
            res.locals.parsedBody,
        );

        return res.status(201).json(prerequisite);
    } catch (err) {
        return next(err);
    }
}

async function deletePrerequisite(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { prerequisiteId } = res.locals.parsedParams;
        await prerequisiteService.remove(prerequisiteId);

        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function checkPrerequisiteOwnership(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { prerequisiteId } = res.locals.parsedParams;
        await prerequisiteService.checkPrerequisiteOwnership(
            prerequisiteId,
            req.user!,
        );
        return next();
    } catch (err) {
        return next(err);
    }
}

export { createPrerequisiteHandler, deletePrerequisiteHandler };
