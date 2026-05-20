import type { User } from '../../../types/user.js';
import type {
    ClonePrerequisiteDTO,
    CreatePrerequisiteDTO,
} from './prerequisite.types.js';
import * as prerequisiteRepository from './prerequisite.repository.js';
import { NotFoundError } from '../../../utils/errors.js';
import { checkSubjectOwnership } from '../subject/subject.service.js';
import type { DbClient } from '../../../types/dbClient.js';
import { prisma } from '../../../config/database.js';
import { type Prerequisite, Prisma } from '../../../generated/prisma/index.js';

async function create(
    prerequisite: CreatePrerequisiteDTO,
    tx: DbClient = prisma,
): Promise<Prerequisite> {
    return await prerequisiteRepository.create(prerequisite, tx);
}

async function findById(prerequisiteId: string): Promise<Prerequisite> {
    const prerequisite = await prerequisiteRepository.findById(prerequisiteId);
    if (!prerequisite) throw new NotFoundError('Prerequisite not found');
    return prerequisite;
}

async function remove(prerequisiteId: string): Promise<Prerequisite> {
    try {
        return await prerequisiteRepository.remove(prerequisiteId);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025')
                throw new NotFoundError('Prerequisite not found');
        }
        throw err;
    }
}

async function clone(
    prerequisites: ClonePrerequisiteDTO[],
    subjectIdMap: Map<string, string>,
    tx: DbClient = prisma,
) {
    prerequisites.forEach(async (prerequisite) => {
        const newSubjectId = subjectIdMap.get(prerequisite.subjectId);
        const newPrerequisiteId = subjectIdMap.get(
            prerequisite.prerequisiteId,
        )!;
        if (!newSubjectId || !newPrerequisiteId)
            throw new NotFoundError('Prerequisite not found');
        await create(
            {
                subjectId: newSubjectId,
                prerequisiteId: newPrerequisiteId,
                type: prerequisite.type,
            },
            tx,
        );
    });
}

async function checkPrerequisiteOwnership(prerequisiteId: string, user: User) {
    const prerequisite = await findById(prerequisiteId);
    await checkSubjectOwnership(prerequisite.subjectId, user);
    await checkSubjectOwnership(prerequisite.prerequisiteId, user);
}

export { create, findById, remove, clone, checkPrerequisiteOwnership };
