import { prisma } from '../../../config/database.js';
import { Career } from '../../../prisma/generated/prisma/client.js';
import { DbClient } from '../../../types/dbClient.js';
import type { CreateCareerDTO, UpdateCareerDTO } from './career.types.js';

async function create(
    career: CreateCareerDTO,
    userId: string,
    tx: DbClient = prisma,
): Promise<Career> {
    return await tx.career.create({
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial,
            userId,
        },
    });
}

async function findManyByUserId(userId: string): Promise<Career[]> {
    return await prisma.career.findMany({
        where: { userId: userId },
        orderBy: { name: "asc" },
    });
}

async function findById(careerId: string): Promise<Career | null> {
    return await prisma.career.findUnique({
        where: {
            id: careerId,
        },
    });
}

async function findByIdWithCategories(careerId: string, tx: DbClient = prisma) {
    return await tx.career.findUnique({
        where: {
            id: careerId,
        },
        include: {
            categories: {
                include: {
                    subcategories: {
                        include: {
                            subjects: {
                                include: {
                                    prerequisites: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

async function update(
    careerId: string,
    career: UpdateCareerDTO,
): Promise<Career> {
    return await prisma.career.update({
        where: {
            id: careerId,
        },
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial,
        },
    });
}

async function remove(careerId: string): Promise<Career> {
    return await prisma.career.delete({
        where: {
            id: careerId,
        },
    });
}

export { create, findManyByUserId, findById, findByIdWithCategories, update, remove };
