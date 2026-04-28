import { prisma } from '../../config/database.js';
import { User } from '../../prisma/generated/prisma/client.js';
import { CreateUserDTO } from './auth.types.js';

async function findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { id: id },
    });
}

async function findByGoogleId(googleId: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { googleId: googleId },
    });
}

async function findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { email },
    });
}

async function create({
    email,
    password,
    name,
    googleId,
    role,
}: CreateUserDTO): Promise<User> {
    return prisma.user.create({
        data: {
            email,
            password,
            name,
            googleId,
            role,
        },
    });

    /*
    Para cuando implemente la sync de cuentas
    if(existing && existing.password && password) throw new ConflictError("Email already registered");
    
    if(googleId) {
        existing = await prisma.user.upsert({
            where: { email },
            update: { googleId: googleId },
            create: { email, name, googleId }
        })
    }

    if(password) {
        existing = await prisma.user.upsert({
            where: { email },
            update: { password: password },
            create: { email, name, password }
        })
    }

    return existing;
    */
}
export { findById, findByGoogleId, findByEmail, create };
