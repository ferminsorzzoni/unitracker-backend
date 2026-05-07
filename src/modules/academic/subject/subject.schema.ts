import z from 'zod';

const createSubjectSchema = z.object({
    name: z.string().min(1),
    weeklyMinutes: z.int().positive().optional(),
    subcategoryId: z.uuid(),
});

const subjectParamsSchema = z.object({
    subjectId: z.uuid(),
});

const updateSubjectSchema = z.object({
    name: z.string().min(1).optional(),
    mark: z.int().min(0).max(10).optional(),
    state: z
        .enum(['PENDING', 'IN_PROGRESS', 'REGULARIZED', 'FAILED', 'PASSED'])
        .optional(),
    weeklyMinutes: z.int().positive().optional(),
});

export { createSubjectSchema, subjectParamsSchema, updateSubjectSchema };
