import { Category, Prisma } from "../../../prisma/generated/prisma/client.js";
import type { User } from "../../../types/user.js";
import { NotFoundError } from "../../../utils/errors.js";
import { checkCareerOwnership } from "../career/career.service.js";
import * as categoryRepository from "./category.repository.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./category.types.js";

async function create(category: CreateCategoryDTO): Promise<Category> {

    const maxOrder = await findMaxOrder(category.careerId) + 1;
    return await categoryRepository.create(category, maxOrder);
}

async function findById(categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);
    if(!category) throw new NotFoundError("Category not found");
    return category;
}

async function update(category: UpdateCategoryDTO, categoryId: string): Promise<Category> {
    try {
        return await categoryRepository.update(category, categoryId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Category not found");
        }
        throw err;
    }
}

async function remove(categoryId: string): Promise<Category> {
    try {
        return await categoryRepository.remove(categoryId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Category not found");
        }
        throw err;
    }
}

async function findMaxOrder(careerId: string): Promise<number> {
    const result = await categoryRepository.findMaxOrder(careerId);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}

async function checkCategoryOwnership(categoryId: string, user: User) {
    const category = await findById(categoryId);
    await checkCareerOwnership(category.careerId, user);
}

export { create, update, remove, checkCategoryOwnership };