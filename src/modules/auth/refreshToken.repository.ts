import { prisma } from '../../config/database.js';
import { RefreshToken } from '../../prisma/generated/prisma/client.js';

async function findByToken(hashedToken: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({
        where: { token: hashedToken },
    });
}

async function removeExpired(userId: string) {
    return await prisma.refreshToken.deleteMany({
        where: { userId: userId, expiresAt: { lt: new Date() } },
    });
}

async function removeByToken(hashedToken: string): Promise<RefreshToken> {
    return await prisma.refreshToken.delete({
        where: {
            token: hashedToken,
        },
    });
}

async function create(
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

export { findByToken, removeExpired, removeByToken, create };
