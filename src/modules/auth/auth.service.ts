import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../utils/errors.js';
import type { PublicUserDTO } from './auth.types.js';
import { Prisma } from '../../prisma/generated/prisma/client.js';
import * as userRepository from './user.repository.js';
import * as refreshTokenRepository from './refreshToken.repository.js';

async function createRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await refreshTokenRepository.create(userId, hashedToken, expiresAt);
    return token;
}

async function validateRefreshToken(token: string): Promise<PublicUserDTO> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const refreshToken = await refreshTokenRepository.findByToken(hashedToken);
    if (!refreshToken) throw new UnauthorizedError('Invalid refresh token');

    if (refreshToken.expiresAt < new Date()) {
        await refreshTokenRepository.removeExpired(refreshToken.userId);
        throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await userRepository.findById(refreshToken.userId);
    if (!user) throw new NotFoundError('User not found');

    return { id: user.id, role: user.role };
}

async function register(
    email: string,
    password: string,
    name: string,
): Promise<PublicUserDTO> {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({
            email,
            password: hashedPassword,
            name,
        });
        return { id: user.id, role: user.role };
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002')
                throw new ConflictError('Email already registered');
        }
        throw err;
    }
}

async function login(email: string, password: string): Promise<PublicUserDTO> {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password)
        throw new UnauthorizedError('Invalid credentials');

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw new UnauthorizedError('Invalid credentials');

    return { id: user.id, role: user.role };
}

async function logout(refreshToken: string, userId: string) {
    const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    const token = await refreshTokenRepository.findByToken(hashedRefreshToken);
    if (!token) return; // si no hay token, ya esta deslogueado
    if (token.userId !== userId)
        throw new UnauthorizedError('Token is not owned by user');

    await refreshTokenRepository.removeByToken(hashedRefreshToken);
}

export { createRefreshToken, validateRefreshToken, register, login, logout };
