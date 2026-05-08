import { prisma } from '../../../config/database.js';
import type { Subject } from '../../../prisma/generated/prisma/client.js';
import type { DbClient } from '../../../types/dbClient.js';
import type { CreateSubjectDTO, UpdateSubjectDTO } from './subject.types.js';

async function create(
    subject: CreateSubjectDTO,
    tx: DbClient = prisma,
): Promise<Subject> {
    return await tx.subject.create({
        data: {
            name: subject.name,
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
    return await prisma.subject.update({
        where: {
            id: subjectId,
        },
        data: {
            name: subject.name,
            mark: subject.mark,
            state: subject.state,
            weeklyMinutes: subject.weeklyMinutes,
        },
    });
}

async function remove(subjectId: string): Promise<Subject> {
    return await prisma.subject.delete({
        where: {
            id: subjectId,
        },
    });
}

export { create, findById, update, remove };
