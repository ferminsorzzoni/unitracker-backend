import { Request, Response, NextFunction } from "express";
import * as subjectService from "./subject.service.js";
import { requireAuth } from "../../../middleware/requireAuth.js";
import { validateBody, validateParams } from "../../../middleware/validate.js";
import { createSubjectSchema, subjectParamsSchema, updateSubjectSchema } from "./subject.schema.js";
import { checkSubjectOwnershipFromBody } from "../../../middleware/checkOwnership.js";

const createSubjectHandler = [requireAuth, validateBody(createSubjectSchema), checkSubjectOwnershipFromBody, createSubject];
const updateSubjectHandler = [requireAuth, validateParams(subjectParamsSchema), validateBody(updateSubjectSchema), checkSubjectOwnership, updateSubject];
const deleteSubjectHandler = [requireAuth, validateParams(subjectParamsSchema), checkSubjectOwnership, deleteSubject];

async function createSubject(req: Request, res: Response, next: NextFunction) {
    try {
        const subject = await subjectService.create(res.locals.parsedBody);

        return res.status(201).json(subject);
    } catch(err) {
        return next(err);
    }
}

async function updateSubject(req: Request, res: Response, next: NextFunction) {
    try {
        const { subjectId } = res.locals.parsedParams;
        const subject = await subjectService.update(res.locals.parsedBody, subjectId);

        return res.json(subject);
    } catch(err) {
        return next(err);
    }
}

async function deleteSubject(req: Request, res: Response, next: NextFunction) {
    try {
        const { subjectId } = res.locals.parsedParams;
        await subjectService.remove(subjectId);

        return res.sendStatus(204);
    } catch(err) {
        return next(err);
    }
}

async function checkSubjectOwnership(req: Request, res: Response, next: NextFunction) {
    try {
        const { subjectId } = res.locals.parsedParams;
        await subjectService.checkSubjectOwnership(subjectId, req.user!);
        return next();
    } catch(err) {
        return next(err);
    }
}

export { createSubjectHandler, updateSubjectHandler, deleteSubjectHandler };