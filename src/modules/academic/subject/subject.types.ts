import z from 'zod';
import { createSubjectSchema, updateSubjectSchema } from './subject.schema.js';
import type { ClonePrerequisiteDTO } from '../prerequisite/prerequisite.types.js';
import { Subject } from '../../../prisma/generated/prisma/client.js';

type CreateSubjectDTO = z.infer<typeof createSubjectSchema>;
type UpdateSubjectDTO = z.infer<typeof updateSubjectSchema>;

type CloneSubjectDTO = Subject & {
    prerequisites: ClonePrerequisiteDTO[],
};

export { CreateSubjectDTO, UpdateSubjectDTO, CloneSubjectDTO };
