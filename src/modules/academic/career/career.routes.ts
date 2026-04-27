import { Router } from 'express';
import { createCareerHandler, deleteCareerHandler, getCareerHandler, updateCareerHandler } from './career.controller.js';

const careerRouter = Router();

careerRouter.post("/", createCareerHandler);
careerRouter.get("/:careerId", getCareerHandler);
careerRouter.patch("/:careerId", updateCareerHandler);
careerRouter.delete("/:careerId", deleteCareerHandler);

export default careerRouter;