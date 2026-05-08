import z from 'zod';
import {
    createSubcategorySchema,
    updateSubcategorySchema,
} from './subcategory.schema.js';
import type { CloneSubjectDTO } from '../subject/subject.types.js';
import { Subcategory } from '../../../prisma/generated/prisma/client.js';

type CreateSubcategoryDTO = z.infer<typeof createSubcategorySchema>;
type UpdateSubcategoryDTO = z.infer<typeof updateSubcategorySchema>;
type CloneSubcategoryDTO = Subcategory & {
    subjects: CloneSubjectDTO[];
};

export { CreateSubcategoryDTO, UpdateSubcategoryDTO, CloneSubcategoryDTO };
