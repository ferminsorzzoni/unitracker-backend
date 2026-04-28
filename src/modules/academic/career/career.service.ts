import { Career, Prisma } from '../../../prisma/generated/prisma/client.js';
import type { Role, User } from '../../../types/user.js';
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../../../utils/errors.js';
import { isAdmin } from '../academic.utils.js';
import * as careerRepository from './career.repository.js';
import type { CreateCareerDTO, UpdateCareerDTO } from './career.types.js';

async function create(career: CreateCareerDTO, user: User): Promise<Career> {
    if (career.isOfficial && !isAdmin(user.role))
        throw new ForbiddenError(
            'User is not ADMIN, cannot set career as official',
        );
    return await careerRepository.create(career, user.id);
}

async function findById(careerId: string): Promise<Career> {
    const career = await careerRepository.findById(careerId);
    if (!career) throw new NotFoundError('Career not found');
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
            if (err.code === 'P2002')
                throw new ConflictError('Conflict updating unique attributes');
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

async function checkCareerOwnership(careerId: string, user: User) {
    const career = await findById(careerId);
    const isOwner = career.userId === user.id;
    if (!isOwner && !isAdmin(user.role))
        throw new ForbiddenError('User does not own the career');
}

export { create, findById, update, remove, checkCareerOwnership };
