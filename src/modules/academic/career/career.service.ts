import { Career, Prisma } from '../../../prisma/generated/prisma/client.js';
import type { Role, User } from '../../../types/user.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { isAdmin } from '../academic.utils.js';
import * as careerRepository from './career.repository.js';
import type { CreateCareerDTO, UpdateCareerDTO } from './career.types.js';
import { clone as cloneCategory } from '../category/category.service.js';
import { prisma } from '../../../config/database.js';
import { DbClient } from '../../../types/dbClient.js';

async function create(career: CreateCareerDTO, user: User, tx: DbClient = prisma): Promise<Career> {
    if (career.isOfficial && !isAdmin(user.role))
        throw new ForbiddenError(
            'User is not ADMIN, cannot set career as official',
        );
    return await careerRepository.create(career, user.id, tx);
}

async function findById(careerId: string): Promise<Career> {
    const career = await careerRepository.findById(careerId);
    if (!career) throw new NotFoundError('Career not found');
    return career;
}

async function findByIdWithCategories(careerId: string, tx: DbClient = prisma) {
    const career = await careerRepository.findByIdWithCategories(careerId, tx);
    if(!career) throw new NotFoundError("Career not found");
    return career;
}

async function update(
    careerId: string,
    career: UpdateCareerDTO,
    role: Role,
): Promise<Career> {
    try {
        if (career.isOfficial && !isAdmin(role))
            throw new ForbiddenError(
                'User is not ADMIN, cannot set career as official',
            );
        return await careerRepository.update(careerId, career);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Career not found');
        }
        throw err;
    }
}

async function remove(careerId: string): Promise<Career> {
    try {
        return await careerRepository.remove(careerId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Career not found');
        }
        throw err;
    }
}

async function clone(careerId: string, user: User): Promise<Career> {
    const career = await findByIdWithCategories(careerId);
    return await prisma.$transaction(async (tx) => {
        const clonedCareer = await create({ name: career.name, institution: career.institution ?? undefined }, user, tx);
        await Promise.all(career.categories.map(category => cloneCategory(category, clonedCareer.id, tx)));
        return await findByIdWithCategories(clonedCareer.id, tx);
    });
}

async function checkCareerOwnership(careerId: string, user: User) {
    const career = await findById(careerId);
    const isOwner = career.userId === user.id;
    if (!isOwner && !isAdmin(user.role))
        throw new ForbiddenError('User does not own the career');
}

export { create, findById, findByIdWithCategories, update, remove, clone, checkCareerOwnership };
