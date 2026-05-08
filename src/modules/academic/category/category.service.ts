import { prisma } from '../../../config/database.js';
import { Category, Prisma } from '../../../prisma/generated/prisma/client.js';
import type { DbClient } from '../../../types/dbClient.js';
import type { User } from '../../../types/user.js';
import { NotFoundError } from '../../../utils/errors.js';
import { checkCareerOwnership } from '../career/career.service.js';
import * as categoryRepository from './category.repository.js';
import type { CloneCategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from './category.types.js';
import { clone as cloneSubcategory } from "./../subcategory/subcategory.service.js";

async function create(category: CreateCategoryDTO, order?: number, tx: DbClient = prisma): Promise<Category> {
    let nextOrder: number;
    if(!order) {
        nextOrder = (await findMaxOrder(category.careerId, tx)) + 1;
    } else {
        nextOrder = order;
    }
    return await categoryRepository.create(category, nextOrder, tx);
}

async function findById(categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);
    if (!category) throw new NotFoundError('Category not found');
    return category;
}

async function update(
    category: UpdateCategoryDTO,
    categoryId: string,
): Promise<Category> {
    try {
        return await categoryRepository.update(category, categoryId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Category not found');
        }
        throw err;
    }
}

async function remove(categoryId: string): Promise<Category> {
    try {
        return await categoryRepository.remove(categoryId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Category not found');
        }
        throw err;
    }
}

async function clone(category: CloneCategoryDTO, careerId: string, tx: DbClient = prisma) {
    const clonedCategory = await create({ name: category.name, careerId: careerId }, category.order, tx);
    await Promise.all(category.subcategories.map(subcategory => cloneSubcategory(subcategory, clonedCategory.id, tx)));
}

async function findMaxOrder(careerId: string, tx: DbClient = prisma): Promise<number> {
    const result = await categoryRepository.findMaxOrder(careerId, tx);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}

async function checkCategoryOwnership(categoryId: string, user: User) {
    const category = await findById(categoryId);
    await checkCareerOwnership(category.careerId, user);
}

export { create, update, remove, clone, checkCategoryOwnership };
