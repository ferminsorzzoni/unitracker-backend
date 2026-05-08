import { prisma } from '../../../config/database.js';
import type { Subcategory } from '../../../prisma/generated/prisma/client.js';
import type { DbClient } from '../../../types/dbClient.js';
import type {
    CreateSubcategoryDTO,
    UpdateSubcategoryDTO,
} from './subcategory.types.js';

async function create(
    subcategory: CreateSubcategoryDTO,
    order: number,
    tx: DbClient = prisma
): Promise<Subcategory> {
    return await tx.subcategory.create({
        data: {
            name: subcategory.name,
            order: order,
            categoryId: subcategory.categoryId,
        },
    });
}

async function findById(subcategoryId: string): Promise<Subcategory | null> {
    return await prisma.subcategory.findUnique({
        where: {
            id: subcategoryId,
        },
    });
}

async function update(
    subcategory: UpdateSubcategoryDTO,
    subcategoryId: string,
): Promise<Subcategory> {
    return await prisma.$transaction(async (tx) => {
        const updatedSubcategory = await tx.subcategory.update({
            where: {
                id: subcategoryId,
            },
            data: {
                name: subcategory.name,
                order: subcategory.order,
            },
        });

        if (subcategory.order) {
            await tx.subcategory.updateMany({
                where: {
                    categoryId: updatedSubcategory.categoryId,
                    order: { gte: subcategory.order },
                    NOT: { id: subcategoryId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }

        return updatedSubcategory;
    });
}

async function remove(subcategoryId: string): Promise<Subcategory> {
    return await prisma.subcategory.delete({
        where: {
            id: subcategoryId,
        },
    });
}

async function findMaxOrder(categoryId: string) {
    return await prisma.subcategory.aggregate({
        where: {
            categoryId: categoryId,
        },
        _max: {
            order: true,
        },
    });
}

export { create, findById, update, remove, findMaxOrder };
