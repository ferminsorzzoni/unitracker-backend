import { prisma } from '../../../config/database.js';
import type { Subject } from '../../../generated/prisma/index.js';
import type { DbClient } from '../../../types/dbClient.js';
import type { CreateSubjectDTO, UpdateSubjectDTO } from './subject.types.js';

async function create(
    subject: CreateSubjectDTO,
    order: number,
    tx: DbClient = prisma,
): Promise<Subject> {
    return await tx.subject.create({
        data: {
            name: subject.name,
            order: order,
            subcategoryId: subject.subcategoryId,
            weeklyMinutes: subject.weeklyMinutes,
        },
    });
}

async function findById(subjectId: string): Promise<Subject | null> {
    return await prisma.subject.findUnique({
        where: {
            id: subjectId,
        },
    });
}

async function update(
    subject: UpdateSubjectDTO,
    subjectId: string,
): Promise<Subject> {
    return await prisma.$transaction(async (tx) => {
        const updatedSubject = await tx.subject.update({
            where: {
                id: subjectId,
            },
            data: {
                name: subject.name,
                mark: subject.mark,
                state: subject.state,
                order: subject.order,
                weeklyMinutes: subject.weeklyMinutes,
            },
        });

        if (subject.order) {
            await tx.subject.updateMany({
                where: {
                    subcategoryId: updatedSubject.subcategoryId,
                    order: { gte: subject.order },
                    NOT: { id: subjectId },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        }

        return updatedSubject;
    });
}

async function remove(subjectId: string): Promise<Subject> {
    return await prisma.subject.delete({
        where: {
            id: subjectId,
        },
    });
}

async function findMaxOrder(subcategoryId: string) {
    return await prisma.subject.aggregate({
        where: {
            subcategoryId: subcategoryId,
        },
        _max: {
            order: true,
        },
    });
}

export { create, findById, update, remove, findMaxOrder };
