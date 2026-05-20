import z from 'zod';
import {
    createCategorySchema,
    updateCategorySchema,
} from './category.schema.js';
import type { CloneSubcategoryDTO } from '../subcategory/subcategory.types.js';
import type { Category } from '../../../generated/prisma/index.js';

type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
type CloneCategoryDTO = Category & {
    subcategories: CloneSubcategoryDTO[];
};

export { CreateCategoryDTO, UpdateCategoryDTO, CloneCategoryDTO };
