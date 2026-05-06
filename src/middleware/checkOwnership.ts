import { Request, Response, NextFunction } from "express";
import { checkCareerOwnership } from "../modules/academic/career/career.service.js";
import { checkCategoryOwnership } from "../modules/academic/category/category.service.js";

async function checkCareerOwnershipFromBody(req: Request, res: Response, next: NextFunction) {
    try {
        const { careerId } = res.locals.parsedBody;
        await checkCareerOwnership(careerId, req.user!);
        return next();
    } catch(err) {
        return next(err);
    }
}

async function checkCategoryOwnershipFromBody(req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId } = res.locals.parsedBody;
        await checkCategoryOwnership(categoryId, req.user!);
        return next();
    } catch(err) {
        return next(err);
    }
}

export { checkCareerOwnershipFromBody, checkCategoryOwnershipFromBody };