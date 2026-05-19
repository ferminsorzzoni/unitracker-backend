import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User } from '../../types/user.js';

function generateAccessToken(user: User): string {
    return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.JWT_SECRET, {
        expiresIn: '15m',
    });
}

export { generateAccessToken };
