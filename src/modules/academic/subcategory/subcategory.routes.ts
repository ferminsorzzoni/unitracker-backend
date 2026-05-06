import { Router } from 'express';
import { createSubcategoryHandler, deleteSubcategoryHandler, updateSubcategoryHandler } from './subcategory.controller';

const subcategoryRouter = Router();

subcategoryRouter.post("/", createSubcategoryHandler);
subcategoryRouter.patch("/:subcategoryId", updateSubcategoryHandler);
subcategoryRouter.delete("/:subcategoryId", deleteSubcategoryHandler);

export default subcategoryRouter;
