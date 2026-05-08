import z from 'zod';
import { createPrerequisiteSchema } from './prerequisite.schema.js';
import { Prerequisite } from '../../../prisma/generated/prisma/client.js';

type CreatePrerequisiteDTO = z.infer<typeof createPrerequisiteSchema>;
type ClonePrerequisiteDTO = Prerequisite;

export { CreatePrerequisiteDTO, ClonePrerequisiteDTO };
