import { Request, Response, NextFunction } from "express";
import { checkCareerOwnership } from "../modules/academic/career/career.service.js";

async function checkCareerOwnershipFromParams(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedParams;
        await checkCareerOwnership(careerId, req.user!);
        return next();
    } catch(err) {
        return next(err);
    }
}

async function checkCareerOwnershipFromBody(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedBody;
        await checkCareerOwnership(careerId, req.user!);
        return next();
    } catch(err) {
        return next(err);
    }
}

export { checkCareerOwnershipFromParams, checkCareerOwnershipFromBody };