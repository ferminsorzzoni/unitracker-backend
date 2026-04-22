import { ConflictError } from "../../utils/errors.js";
import { prisma } from "../../config/database.js";

async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id: id },
    });
}

async function findUserByGoogleId(googleId) {
    return await prisma.user.findUnique({
        where: { googleId: googleId },
    });
}

async function findUserByEmail(email) {
    return await prisma.user.findUnique({ 
        where: { email }
    });
}

async function createUser({ email, password, name, googleId }) {
    let existing = await findUserByEmail(email);

    if(existing) throw new ConflictError("Email already registered");

    /*
    Para cuando implemente la sync de cuentas
    if(existing && existing.password && password) throw new ConflictError("Email already registered");
    */

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
}

async function findRefreshToken(hashedToken) {
    return await prisma.refreshToken.findUnique({
        where: { token: hashedToken }
    });
}

async function deleteExpiredTokens(userId) {
    return await prisma.refreshToken.deleteMany({
        where: { userId: userId,
        expiresAt: { lt: new Date() }
    }
    });
}

async function deleteRefreshToken(hashedToken) {
    return await prisma.refreshToken.delete({
        where: {
            token: hashedToken
        },
    });
}

async function createHashedToken(userId, hashedToken, expiresAt) {
    return await prisma.refreshToken.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt
        }
    });
}

export { findUserById, findUserByGoogleId, findUserByEmail, createUser, findRefreshToken, deleteExpiredTokens, deleteRefreshToken, createHashedToken };