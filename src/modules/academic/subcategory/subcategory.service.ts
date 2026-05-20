import { prisma } from '../../../config/database.js';
import type { DbClient } from '../../../types/dbClient.js';
import type { User } from '../../../types/user.js';
import { NotFoundError } from '../../../utils/errors.js';
import { checkCategoryOwnership } from '../category/category.service.js';
import * as subcategoryRepository from './subcategory.repository.js';
import type {
    CloneSubcategoryDTO,
    CreateSubcategoryDTO,
    UpdateSubcategoryDTO,
} from './subcategory.types.js';
import { clone as cloneSubject } from '../subject/subject.service.js';
import { clone as clonePrerequisites } from '../prerequisite/prerequisite.service.js';
import { Prisma, type Subcategory } from '../../../generated/prisma/index.js';

async function create(
    subcategory: CreateSubcategoryDTO,
    order?: number,
    tx: DbClient = prisma,
): Promise<Subcategory> {
    let nextOrder: number;
    if (!order) {
        nextOrder = (await findMaxOrder(subcategory.categoryId)) + 1;
    } else {
        nextOrder = order;
    }
    return await subcategoryRepository.create(subcategory, nextOrder, tx);
}

async function findById(subcategoryId: string): Promise<Subcategory> {
    const subcategory = await subcategoryRepository.findById(subcategoryId);
    if (!subcategory) throw new NotFoundError('Subcategory not found');
    return subcategory;
}

async function update(
    subcategory: UpdateSubcategoryDTO,
    subcategoryId: string,
): Promise<Subcategory> {
    try {
        return await subcategoryRepository.update(subcategory, subcategoryId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Subcategory not found');
        }
        throw err;
    }
}

async function remove(subcategoryId: string): Promise<Subcategory> {
    try {
        return await subcategoryRepository.remove(subcategoryId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Subcategory not found');
        }
        throw err;
    }
}

async function clone(
    subcategory: CloneSubcategoryDTO,
    categoryId: string,
    tx: DbClient = prisma,
) {
    const clonedSubcategory = await create(
        { name: subcategory.name, categoryId: categoryId },
        subcategory.order,
        tx,
    );
    const subjectIdMap = new Map<string, string>();
    await Promise.all(
        subcategory.subjects.map(async (subject) => {
            const clonedSubject = await cloneSubject(
                subject,
                clonedSubcategory.id,
                tx,
            );
            subjectIdMap.set(subject.id, clonedSubject.id);
            return clonedSubject;
        }),
    );
    await Promise.all(
        subcategory.subjects.map((subject) =>
            clonePrerequisites(subject.prerequisites, subjectIdMap, tx),
        ),
    );
}

async function findMaxOrder(categoryId: string): Promise<number> {
    const result = await subcategoryRepository.findMaxOrder(categoryId);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}

async function checkSubcategoryOwnership(subcategoryId: string, user: User) {
    const subcategory = await findById(subcategoryId);
    await checkCategoryOwnership(subcategory.categoryId, user);
}

export { create, update, remove, clone, checkSubcategoryOwnership };
