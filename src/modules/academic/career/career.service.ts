import { Prisma } from "../../../prisma/generated/prisma/client";
import type { Role, User } from "../../../types/express.d.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../../utils/errors.js";
import * as careerRepository from "./career.repository.js";
import type { CreateCareerDTO, UpdateCareerDTO } from "./career.types.js";

function create(career: CreateCareerDTO, user: User) {
    if(career.isOfficial && !isAdmin(user.role)) throw new ForbiddenError("User is not ADMIN, cannot set career as official")
    return careerRepository.create(career, user.id);
}

async function findById(careerId: string) {
    const career = await careerRepository.findById(careerId);
    if(!career) throw new NotFoundError("Career not found");
    return career;
    
}

async function update(careerId: string, career: UpdateCareerDTO, role: Role) {
    try {
        if(career.isOfficial && !isAdmin(role)) throw new ForbiddenError("User is not ADMIN, cannot set career as official")
        return await careerRepository.update(careerId, career);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2002") throw new ConflictError("Conflict updating unique attributes");
            if(err.code === "P2025") throw new NotFoundError("Career not found");
        }
        throw err;
    }
}

async function remove(careerId: string) {
    try {
        return await careerRepository.remove(careerId);
    } catch(err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError) {
            if(err.code === "P2025") throw new NotFoundError("Career not found");
        }
        throw err;
    }
}


async function checkCareerOwnership(careerId: string, user: User) {
    const career = await findById(careerId);
    const isOwner = career.userId === user.id;
    if(!isOwner && !isAdmin(user.role)) throw new ForbiddenError("User does not own the career");
}

function isAdmin(role: Role) {
    return role === "ADMIN";
}

export { create, findById, update, remove, checkCareerOwnership };