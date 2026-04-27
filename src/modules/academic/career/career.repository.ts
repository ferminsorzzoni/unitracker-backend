import { prisma } from "../../../config/database.js";
import type { CreateCareerDTO, UpdateCareerDTO } from "./career.types.js";

async function create(career: CreateCareerDTO, userId: string) {
    return await prisma.career.create({
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial,
            userId
        }
    })
}

async function findById(careerId: string) {
    return await prisma.career.findUnique({
        where: {
            id: careerId
        }
    })
}

async function update(careerId: string, career: UpdateCareerDTO) {
    return await prisma.career.update({
        where: {
            id: careerId,
        },
        data: {
            name: career.name,
            institution: career.institution,
            isOfficial: career.isOfficial
        }
    })
}

async function remove(careerId: string) {
    return await prisma.career.delete({
        where: {
            id: careerId,
        }
    })
}

export { create, findById, update, remove };