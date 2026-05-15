import { Request, Response, NextFunction } from 'express';
import * as careerService from './career.service.js';
import {
    careerParamsSchema,
    createCareerSchema,
    updateCareerSchema,
} from './career.schema.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import { requireAuth } from '../../../middleware/requireAuth.js';

const createCareerHandler = [
    requireAuth,
    validateBody(createCareerSchema),
    createCareer,
];
const getMyCareersHandler = [requireAuth, getMyCareers];
const getCareerHandler = [validateParams(careerParamsSchema), getCareer];
const updateCareerHandler = [
    requireAuth,
    validateParams(careerParamsSchema),
    validateBody(updateCareerSchema),
    checkCareerOwnership,
    updateCareer,
];
const deleteCareerHandler = [
    requireAuth,
    validateParams(careerParamsSchema),
    checkCareerOwnership,
    deleteCareer,
];

const cloneCareerHandler = [
    requireAuth,
    validateParams(careerParamsSchema),
    cloneCareer,
];

async function createCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const career = await careerService.create(res.locals.parsedBody, user);

        return res.status(201).json(career);
    } catch (err) {
        return next(err);
    }
}

async function getMyCareers(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const careers = await careerService.findManyByUserId(user.id);

        return res.json(careers);
    } catch(err) {
        return next(err);
    }
}

async function getCareer(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedParams;
        const career = await careerService.findByIdWithCategories(careerId);
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

async function checkCareerOwnership(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { careerId } = res.locals.parsedParams;
        await careerService.checkCareerOwnership(careerId, req.user!);
        return next();
    } catch (err) {
        return next(err);
    }
}

export {
    createCareerHandler,
    getCareerHandler,
    getMyCareersHandler,
    updateCareerHandler,
    deleteCareerHandler,
    cloneCareerHandler,
};
