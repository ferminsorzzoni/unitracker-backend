import z from "zod";

const createCategorySchema = z.object({
    name: z.string().min(1),
    careerId: z.uuid(),
});

const categoryParamsSchema = z.object({
    categoryId: z.uuid(),
});

const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    order: z.int().positive().optional(),
});

export { createCategorySchema, categoryParamsSchema, updateCategorySchema };