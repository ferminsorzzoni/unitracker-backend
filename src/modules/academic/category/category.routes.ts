import { Router } from 'express';
import { createCategoryHandler, deleteCategoryHandler, updateCategoryHandler } from './category.controller.js';

const categoryRouter = Router();

categoryRouter.post("/:careerId", createCategoryHandler);
categoryRouter.patch("/:categoryId", updateCategoryHandler);
categoryRouter.delete("/:categoryId", deleteCategoryHandler);

export default categoryRouter;
