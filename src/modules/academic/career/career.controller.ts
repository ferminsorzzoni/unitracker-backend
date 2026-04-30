import { Request, Response, NextFunction } from 'express';
import * as careerService from './career.service.js';
import {
    careerParamsSchema,
    createCareerSchema,
    updateCareerSchema,
} from './career.schema.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import { requireAuth } from '../../../middleware/requireAuth.js';
import { checkCareerOwnershipFromParams } from '../../../middleware/checkCareerOwnership.js';

const createCareerHandler = [
    requireAuth,
    validateBody(createCareerSchema),
    createCareer,
];
const getCareerHandler = [validateParams(careerParamsSchema), getCareer];
const updateCareerHandler = [
    requireAuth,
    validateParams(careerParamsSchema),
    validateBody(updateCareerSchema),
    checkCareerOwnershipFromParams,
    updateCareer,
];
const deleteCareerHandler = [
    requireAuth,
    validateParams(careerParamsSchema),
    checkCareerOwnershipFromParams,
    deleteCareer,
];
// TODO
const cloneCareerHandler = [cloneCareer];

async function createCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const career = await careerService.create(res.locals.parsedBody, user);

        return res.status(201).json(career);
    } catch (err) {
        return next(err);
    }
}

async function getCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedParams;
        const career = await careerService.findById(careerId);
        return res.json(career);
    } catch (err) {
        return next(err);
    }
}

async function updateCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const { role } = req.user!;
        const { careerId } = res.locals.parsedParams;
        const career = await careerService.update(
            careerId,
            res.locals.parsedBody,
            role,
        );
        return res.json(career);
    } catch (err) {
        return next(err);
    }
}

async function deleteCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedParams;
        await careerService.remove(careerId);
        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

async function cloneCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedParams;
        const user = req.user!;
        const career = await careerService.clone(careerId, user);
        return res.status(201).json(career);
    } catch (err) {
        return next(err);
    }
}

export {
    createCareerHandler,
    getCareerHandler,
    updateCareerHandler,
    deleteCareerHandler,
    cloneCareerHandler,
};
