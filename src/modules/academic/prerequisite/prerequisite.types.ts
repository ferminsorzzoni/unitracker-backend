import z from 'zod';
import { createPrerequisiteSchema } from './prerequisite.schema.js';
import type { Prerequisite } from '../../../generated/prisma/index.js';

type CreatePrerequisiteDTO = z.infer<typeof createPrerequisiteSchema>;
type ClonePrerequisiteDTO = Prerequisite;

export { CreatePrerequisiteDTO, ClonePrerequisiteDTO };
