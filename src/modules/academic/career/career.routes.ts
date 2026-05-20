import { Router } from 'express';
import {
    cloneCareerHandler,
    createCareerHandler,
    deleteCareerHandler,
    getCareerHandler,
    getMyCareersHandler,
    updateCareerHandler,
} from './career.controller.js';

const careerRouter = Router();

careerRouter.post('/', createCareerHandler);
careerRouter.get('/my', getMyCareersHandler);
careerRouter.get('/:careerId', getCareerHandler);
careerRouter.patch('/:careerId', updateCareerHandler);
careerRouter.delete('/:careerId', deleteCareerHandler);
careerRouter.post('/:careerId/clone', cloneCareerHandler);

export default careerRouter;
