import { prisma } from '../../../config/database.js';
import type { Category } from '../../../generated/prisma/index.js';
import { DbClient } from '../../../types/dbClient.js';
import type { CreateCategoryDTO, UpdateCategoryDTO } from './category.types.js';

async function create(
    category: CreateCategoryDTO,
    order: number,
    tx: DbClient = prisma,
): Promise<Category> {
    return await tx.category.create({
        data: {
            name: category.name,
            order: order,
            careerId: category.careerId,
        },
    });
}

async function findById(categoryId: string): Promise<Category | null> {
    return await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
}

async function update(
    category: UpdateCategoryDTO,
    categoryId: string,
): Promise<Category> {
    return await prisma.$transaction(async (tx) => {
        const updatedCategory = await tx.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: category.name,
                order: category.order,
            },
        });

        if (category.order) {
            await tx.category.updateMany({
                where: {
                    careerId: updatedCategory.careerId,
                    order: { gte: category.order },
                    NOT: { id: categoryId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }

        return updatedCategory;
    });
}

async function remove(categoryId: string): Promise<Category> {
    return await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
}

async function findMaxOrder(careerId: string, tx: DbClient = prisma) {
    return await tx.category.aggregate({
        where: {
            careerId: careerId,
        },
        _max: {
            order: true,
        },
    });
}

export { create, findById, update, remove, findMaxOrder };
