"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = createRefreshToken;
exports.validateRefreshToken = validateRefreshToken;
exports.register = register;
exports.login = login;
exports.logout = logout;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_js_1 = require("../../utils/errors.js");
const userRepository = __importStar(require("./user.repository.js"));
const refreshTokenRepository = __importStar(require("./refreshToken.repository.js"));
const index_js_1 = require("../../generated/prisma/index.js");
async function createRefreshToken(userId) {
    const token = crypto_1.default.randomBytes(64).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await refreshTokenRepository.create(userId, hashedToken, expiresAt);
    return token;
}
async function validateRefreshToken(token) {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const refreshToken = await refreshTokenRepository.findByToken(hashedToken);
    if (!refreshToken)
        throw new errors_js_1.UnauthorizedError('Invalid refresh token');
    if (refreshToken.expiresAt < new Date()) {
        await refreshTokenRepository.removeExpired(refreshToken.userId);
        throw new errors_js_1.UnauthorizedError('Invalid refresh token');
    }
    const user = await userRepository.findById(refreshToken.userId);
    if (!user)
        throw new errors_js_1.NotFoundError('User not found');
    return { id: user.id, email: user.email, role: user.role };
}
async function register(email, password, name) {
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await userRepository.create({
            email,
            password: hashedPassword,
            name,
        });
        return { id: user.id, email: user.email, role: user.role };
    }
    catch (err) {
        if (err instanceof index_js_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002')
                throw new errors_js_1.ConflictError('Email already registered');
        }
        throw err;
    }
}
async function login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password)
        throw new errors_js_1.UnauthorizedError('Invalid credentials');
    const isPassword = await bcrypt_1.default.compare(password, user.password);
    if (!isPassword)
        throw new errors_js_1.UnauthorizedError('Invalid credentials');
    return { id: user.id, email: user.email, role: user.role };
}
async function logout(refreshToken, userId) {
    const hashedRefreshToken = crypto_1.default
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    const token = await refreshTokenRepository.findByToken(hashedRefreshToken);
    if (!token)
        return; // si no hay token, ya esta deslogueado
    if (token.userId !== userId)
        throw new errors_js_1.UnauthorizedError('Token is not owned by user');
    await refreshTokenRepository.removeByToken(hashedRefreshToken);
}
