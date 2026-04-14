import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import { createHashedToken, deleteExpiredTokens, findRefreshToken } from "./auth.repository.js";

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

    if(!refreshToken) return null;
    if(refreshToken.expiresAt < new Date()) {
        await deleteExpiredTokens(refreshToken.userId);
        return null;
    }
    return refreshToken;
}

export { generateAccessToken, generateRefreshToken, getRefreshToken };