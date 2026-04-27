import z from "zod";
import { createCareerSchema, updateCareerSchema } from "./career.schema.js";

type CreateCareerDTO = z.infer<typeof createCareerSchema>
type UpdateCareerDTO = z.infer<typeof updateCareerSchema>

export { CreateCareerDTO, UpdateCareerDTO };