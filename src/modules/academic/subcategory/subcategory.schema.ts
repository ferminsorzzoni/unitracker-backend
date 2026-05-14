import z from 'zod';

const createSubcategorySchema = z.object({
    name: z.string().trim().min(1),
    categoryId: z.uuid(),
});

const subcategoryParamsSchema = z.object({
    subcategoryId: z.uuid(),
});

const updateSubcategorySchema = z.object({
    name: z.string().trim().min(1).optional(),
    order: z.int().positive().optional(),
});

export {
    createSubcategorySchema,
    subcategoryParamsSchema,
    updateSubcategorySchema,
};
