import z from "zod";
import { createSubjectSchema, updateSubjectSchema } from "./subject.schema.js";

type CreateSubjectDTO = z.infer<typeof createSubjectSchema>
type UpdateSubjectDTO = z.infer<typeof updateSubjectSchema>

export { CreateSubjectDTO, UpdateSubjectDTO };