import z from 'zod';
import {
    createCategorySchema,
    updateCategorySchema,
} from './category.schema.js';

type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;

export { CreateCategoryDTO, UpdateCategoryDTO };
