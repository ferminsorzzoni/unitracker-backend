import z from 'zod';

const createCareerSchema = z.object({
    name: z.string().min(1),
    institution: z.string().optional(),
    isOfficial: z.boolean().optional(),
});

const careerParamsSchema = z.object({
    careerId: z.uuid(),
});

const updateCareerSchema = z.object({
    name: z.string().min(1).optional(),
    institution: z.string().optional(),
    isOfficial: z.boolean().optional(),
});

export { createCareerSchema, careerParamsSchema, updateCareerSchema };
