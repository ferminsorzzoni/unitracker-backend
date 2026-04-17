import { z } from "zod";

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(2)
});

export { registerSchema };