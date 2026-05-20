import z from 'zod';
import { createSubjectSchema, updateSubjectSchema } from './subject.schema.js';
import type { ClonePrerequisiteDTO } from '../prerequisite/prerequisite.types.js';
import type { Subject } from '../../../generated/prisma/index.js';

type CreateSubjectDTO = z.infer<typeof createSubjectSchema>;
type UpdateSubjectDTO = z.infer<typeof updateSubjectSchema>;

type CloneSubjectDTO = Subject & {
    prerequisites: ClonePrerequisiteDTO[];
};

export { CreateSubjectDTO, UpdateSubjectDTO, CloneSubjectDTO };
