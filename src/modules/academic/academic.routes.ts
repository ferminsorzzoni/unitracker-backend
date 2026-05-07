import { Router } from 'express';
import careerRouter from './career/career.routes.js';
import categoryRouter from './category/category.routes.js';
import subcategoryRouter from './subcategory/subcategory.routes.js';
import subjectRouter from './subject/subject.routes.js';
import prerequisiteRouter from './prerequisite/prerequisite.routes.js';

const academicRouter = Router();

academicRouter.use('/careers', careerRouter);
academicRouter.use('/categories', categoryRouter);
academicRouter.use('/subcategories', subcategoryRouter);
academicRouter.use('/subjects', subjectRouter);
academicRouter.use('/prerequisites', prerequisiteRouter);

export default academicRouter;
