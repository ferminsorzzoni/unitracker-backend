import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';
import {
    createHashedToken,
    createUser,
    deleteExpiredTokens,
    deleteRefreshToken,
    findRefreshToken,
    findUserByEmail,
    findUserById,
} from './auth.repository.js';
import { ConflictError, UnauthorizedError } from '../../utils/errors.js';
import type { PublicUserDTO } from './auth.types.js';
import { RefreshToken } from '../../prisma/generated/prisma/client.js';

async function generateAccessToken(userId: string, role?: string) {

    if(!role) {
        const user = await findUserById(userId);
        role = user!.role;
    }
    return jwt.sign({ sub: userId, role: role }, env.JWT_SECRET, { expiresIn: '15m' });
}

async function generateRefreshToken(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await createHashedToken(userId, hashedToken, expiresAt);
    return token;
}

async function getRefreshToken(token: string): Promise<RefreshToken> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const refreshToken = await findRefreshToken(hashedToken);

    if (!refreshToken) throw new UnauthorizedError('Invalid refresh token');
    if (refreshToken.expiresAt < new Date()) {
        await deleteExpiredTokens(refreshToken.userId);
        throw new UnauthorizedError('Invalid refresh token');
    }
    return refreshToken;
}

async function registerService(
    email: string,
    password: string,
    name: string,
): Promise<PublicUserDTO> {
    if (await findUserByEmail(email))
        throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
        email,
        password: hashedPassword,
        name,
    });

    return { id: user.id, email: user.email, name: user.name };
}

async function loginService(
    email: string,
    password: string,
): Promise<PublicUserDTO> {
    const user = await findUserByEmail(email);
    if (!user || !user.password)
        throw new UnauthorizedError('Invalid credentials');

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw new UnauthorizedError('Invalid credentials');

    return { id: user.id, email: user.email, name: user.name };
}

async function logoutService(refreshToken: string) {
    const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    await deleteRefreshToken(hashedRefreshToken);
}

export {
    generateAccessToken,
    generateRefreshToken,
    getRefreshToken,
    registerService,
    loginService,
    logoutService,
};
