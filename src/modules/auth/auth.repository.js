import { ConflictError } from "../../utils/errors.js";

async function findUserById(id) {
    
}

async function findUserByProviderId(providerId) {

}

async function findUserByEmail(email) {
    // prisma.user.findUnique({ where: { email }});
}

async function createUser({ email, password, name, providerId }) {
    let existing = await findUserByEmail(email);

    if(existing && existing.password && password) throw new ConflictError("Email already registered");

    if(providerId) {
        existing = await prisma.user.upsert({
            where: { email },
            update: { googleId: providerId },
            create: { email, name, googleId: providerId }
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

async function findRefreshToken(userId, hashedToken) {

}

async function deleteExpiredTokens(userId) {

}

async function createHashedToken(userId, hashedToken, expiresAt) {

}

export { findUserById, findUserByProviderId, findUserByEmail, createUser, findRefreshToken, deleteExpiredTokens, createHashedToken };