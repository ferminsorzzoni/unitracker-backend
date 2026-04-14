async function findUserById(id) {
    
}

async function findUserByProviderId(providerId) {

}

async function createUser({ email, password, name, providerId }) {

}

async function findRefreshToken(userId, hashedToken) {

}

async function deleteExpiredTokens(userId) {

}

async function createHashedToken(userId, hashedToken, expiresAt) {

}

export { findUserById, findUserByProviderId, createUser, findRefreshToken, deleteExpiredTokens, createHashedToken };