import { Router } from 'express';
import { createPrerequisiteHandler, deletePrerequisiteHandler } from './prerequisite.controller.js';

const prerequisiteRouter = Router();

prerequisiteRouter.post("/", createPrerequisiteHandler);
prerequisiteRouter.delete("/:prerequisiteId", deletePrerequisiteHandler);

export default prerequisiteRouter;