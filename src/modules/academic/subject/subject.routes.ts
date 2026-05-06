import { Router } from 'express';
import { createSubjectHandler, deleteSubjectHandler, updateSubjectHandler } from './subject.controller.js';

const subjectRouter = Router();

subjectRouter.post("/", createSubjectHandler);
subjectRouter.patch("/:subjectId", updateSubjectHandler);
subjectRouter.delete("/:subjectId", deleteSubjectHandler);

export default subjectRouter;
