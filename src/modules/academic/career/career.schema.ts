import z from 'zod';

const createCareerSchema = z.object({
    name: z.string().trim().min(1),
    institution: z.string().trim().min(1).optional(),
    isOfficial: z.boolean().optional(),
});

const careerParamsSchema = z.object({
    careerId: z.uuid(),
});

const updateCareerSchema = createCareerSchema.partial();

export { createCareerSchema, careerParamsSchema, updateCareerSchema };
