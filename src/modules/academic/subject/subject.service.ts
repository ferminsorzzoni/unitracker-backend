import { prisma } from '../../../config/database.js';
import { Prisma, type Subject } from '../../../generated/prisma/index.js';
import type { DbClient } from '../../../types/dbClient.js';
import type { User } from '../../../types/user.js';
import { NotFoundError } from '../../../utils/errors.js';
import { checkSubcategoryOwnership } from '../subcategory/subcategory.service.js';
import * as subjectRepository from './subject.repository.js';
import type {
    CloneSubjectDTO,
    CreateSubjectDTO,
    UpdateSubjectDTO,
} from './subject.types.js';

async function create(
    subject: CreateSubjectDTO,
    order?: number,
    tx: DbClient = prisma,
): Promise<Subject> {
    let nextOrder: number;
    if(!order) {
        nextOrder = (await findMaxOrder(subject.subcategoryId)) + 1;
    } else {
        nextOrder = order;
    }
    return await subjectRepository.create(subject, nextOrder, tx);
}

async function findById(subjectId: string): Promise<Subject> {
    const subject = await subjectRepository.findById(subjectId);
    if (!subject) throw new NotFoundError('Subject not found');
    return subject;
}

async function update(
    subject: UpdateSubjectDTO,
    subjectId: string,
): Promise<Subject> {
    try {
        return await subjectRepository.update(subject, subjectId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Subject not found');
        }
        throw err;
    }
}

async function remove(subjectId: string): Promise<Subject> {
    try {
        return await subjectRepository.remove(subjectId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Subject not found');
        }
        throw err;
    }
}

async function clone(
    subject: CloneSubjectDTO,
    subcategoryId: string,
    tx: DbClient = prisma,
) {
    return await create(
        {
            name: subject.name,
            subcategoryId: subcategoryId,
            weeklyMinutes: subject.weeklyMinutes ?? undefined,
        },
        subject.order,
        tx,
    );
}

async function findMaxOrder(subcategoryId: string): Promise<number> {
    const result = await subjectRepository.findMaxOrder(subcategoryId);
    const maxOrder = result._max.order ?? 0;
    return maxOrder;
}

async function checkSubjectOwnership(subjectId: string, user: User) {
    const subject = await findById(subjectId);
    await checkSubcategoryOwnership(subject.subcategoryId, user);
}

export { create, update, remove, clone, checkSubjectOwnership };
