import { Prisma, Prerequisite } from "../../../prisma/generated/prisma/client.js";
import type { User } from "../../../types/user.js";
import type { CreatePrerequisiteDTO } from "./prerequisite.types.js";
import * as prerequisiteRepository from "./prerequisite.repository.js";
import { NotFoundError } from "../../../utils/errors.js";
import { checkSubjectOwnership } from "../subject/subject.service.js";

async function create(prerequisite: CreatePrerequisiteDTO): Promise<Prerequisite> {
    return await prerequisiteRepository.create(prerequisite);
}

async function findById(prerequisiteId: string): Promise<Prerequisite> {
    const prerequisite = await prerequisiteRepository.findById(prerequisiteId);
    if(!prerequisite) throw new NotFoundError("Prerequisite not found");
    return prerequisite;
}

async function remove(prerequisiteId: string): Promise<Prerequisite> {
    try {
        return await prerequisiteRepository.remove(prerequisiteId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Prerequisite not found");
        }
        throw err;
    }
}

async function checkPrerequisiteOwnership(prerequisiteId: string, user: User) {
    const prerequisite = await findById(prerequisiteId);
    await checkSubjectOwnership(prerequisite.subjectId, user);
    await checkSubjectOwnership(prerequisite.prerequisiteId, user);
}

export { create, findById, remove, checkPrerequisiteOwnership };