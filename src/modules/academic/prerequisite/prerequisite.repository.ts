import { prisma } from '../../../config/database.js';
import { Prerequisite } from '../../../prisma/generated/prisma/client.js';
import { CreatePrerequisiteDTO } from './prerequisite.types.js';

async function create(
    prerequisite: CreatePrerequisiteDTO,
): Promise<Prerequisite> {
    return await prisma.prerequisite.create({
        data: {
            type: prerequisite.type,
            subjectId: prerequisite.subjectId,
            prerequisiteId: prerequisite.prerequisiteId,
        },
    });
}

async function findById(prerequisiteId: string): Promise<Prerequisite | null> {
    return await prisma.prerequisite.findUnique({
        where: {
            id: prerequisiteId,
        },
    });
}

async function remove(prerequisiteId: string): Promise<Prerequisite> {
    return await prisma.prerequisite.delete({
        where: {
            id: prerequisiteId,
        },
    });
}

export { create, findById, remove };
