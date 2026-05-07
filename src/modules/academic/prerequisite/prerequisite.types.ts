import z from 'zod';
import { createPrerequisiteSchema } from './prerequisite.schema.js';

type CreatePrerequisiteDTO = z.infer<typeof createPrerequisiteSchema>;

export { CreatePrerequisiteDTO };
