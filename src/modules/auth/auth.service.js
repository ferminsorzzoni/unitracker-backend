import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { createHashedToken, deleteExpiredTokens, findRefreshToken, findUserByEmail } from "./auth.repository.js";
import { UnauthorizedError } from "../../utils/errors.js";

function generateAccessToken(userId) {
    return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });
}

async function generateRefreshToken(userId) {
    const token = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await createHashedToken(userId, hashedToken, expiresAt);
    return token;
}

async function getRefreshToken(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const refreshToken = await findRefreshToken(hashedToken);

    if(!refreshToken) throw new UnauthorizedError("Invalid refresh token");
    if(refreshToken.expiresAt < new Date()) {
        await deleteExpiredTokens(refreshToken.userId);
        throw new UnauthorizedError("Invalid refresh token");
    }
    return refreshToken;
}

async function registerService(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ email, password: hashedPassword, name });
    return { id: user.id, email: user.email, name: user.name };
}

async function loginService(email, password) {
    const user = await findUserByEmail(email);
    if(!user) throw new UnauthorizedError("Invalid credentials");

    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword) throw new UnauthorizedError("Invalid credentials");

    return { id: user.id, email: user.email, name: user.name };
}

export { generateAccessToken, generateRefreshToken, getRefreshToken, registerService, loginService };