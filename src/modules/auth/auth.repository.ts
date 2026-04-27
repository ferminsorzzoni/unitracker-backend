import { prisma } from '../../config/database.js';
import { RefreshToken, User } from '../../prisma/generated/prisma/client.js';
import { CreateUserDTO } from './auth.types.js';

async function findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { id: id },
    });
}

async function findUserByGoogleId(googleId: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { googleId: googleId },
    });
}

async function findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { email },
    });
}

async function createUser({
    email,
    password,
    name,
    googleId,
}: CreateUserDTO): Promise<User> {
    return prisma.user.create({
        data: {
            email,
            password,
            name,
            googleId,
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

async function findRefreshToken(
    hashedToken: string,
): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({
        where: { token: hashedToken },
    });
}

async function deleteExpiredTokens(userId: string) {
    return await prisma.refreshToken.deleteMany({
        where: { userId: userId, expiresAt: { lt: new Date() } },
    });
}

async function deleteRefreshToken(hashedToken: string) {
    return await prisma.refreshToken.deleteMany({
        where: {
            token: hashedToken,
        },
    });
}

async function createHashedToken(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
): Promise<RefreshToken> {
    return await prisma.refreshToken.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt,
        },
    });
}

export {
    findUserById,
    findUserByGoogleId,
    findUserByEmail,
    createUser,
    findRefreshToken,
    deleteExpiredTokens,
    deleteRefreshToken,
    createHashedToken,
};
