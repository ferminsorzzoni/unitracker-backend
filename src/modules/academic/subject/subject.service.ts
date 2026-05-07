import { Prisma } from "../../../prisma/generated/prisma/client.js";
import type { User } from "../../../types/user.js";
import { NotFoundError } from "../../../utils/errors.js";
import { checkSubcategoryOwnership } from "../subcategory/subcategory.service.js";
import * as subjectRepository from "./subject.repository.js";
import type { CreateSubjectDTO, UpdateSubjectDTO } from "./subject.types.js";

async function create(subject: CreateSubjectDTO) {
    return await subjectRepository.create(subject);
}

async function findById(subjectId: string) {
    const subject = await subjectRepository.findById(subjectId);
    if(!subject) throw new NotFoundError("Subject not found");
    return subject;
}

async function update(subject: UpdateSubjectDTO, subjectId: string) {
    try {
        return await subjectRepository.update(subject, subjectId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Subject not found");
        }
        throw err;
    }
}

async function remove(subjectId: string) {
    try {
        return await subjectRepository.remove(subjectId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Subject not found");
        }
        throw err;
    }
}

async function checkSubjectOwnership(subjectId: string, user: User) {
    const subject = await findById(subjectId);
    await checkSubcategoryOwnership(subject.subcategoryId, user);
}

export { create, update, remove, checkSubjectOwnership };