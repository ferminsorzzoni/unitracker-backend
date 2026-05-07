import z from 'zod';
import {
    createSubcategorySchema,
    updateSubcategorySchema,
} from './subcategory.schema.js';

type CreateSubcategoryDTO = z.infer<typeof createSubcategorySchema>;
type UpdateSubcategoryDTO = z.infer<typeof updateSubcategorySchema>;

export { CreateSubcategoryDTO, UpdateSubcategoryDTO };
