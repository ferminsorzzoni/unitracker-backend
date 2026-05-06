import { Prisma, Subcategory } from "../../../prisma/generated/prisma/client.js";
import type { User } from "../../../types/user.js";
import { NotFoundError } from "../../../utils/errors.js";
import { checkCategoryOwnership } from "../category/category.service.js";
import * as subcategoryRepository from "./subcategory.repository.js";
import type { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "./subcategory.types";

async function create(subcategory: CreateSubcategoryDTO): Promise<Subcategory> {
    const maxOrder = await findMaxOrder(subcategory.categoryId) + 1;
    return await subcategoryRepository.create(subcategory, maxOrder);
}

async function findById(subcategoryId: string): Promise<Subcategory> {
    const subcategory = await subcategoryRepository.findById(subcategoryId);
    if(!subcategory) throw new NotFoundError("Subcategory not found");
    return subcategory;
}

async function update(subcategory: UpdateSubcategoryDTO, subcategoryId: string): Promise<Subcategory> {
    try {
        return await subcategoryRepository.update(subcategory, subcategoryId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Subcategory not found");
        }
        throw err;
    }
}

async function remove(subcategoryId: string): Promise<Subcategory> {
    try {
        return await subcategoryRepository.remove(subcategoryId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Subcategory not found");
        }
        throw err;
    }
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

export { create, update, remove, checkSubcategoryOwnership };