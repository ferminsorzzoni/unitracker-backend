import passport from 'passport';
import * as authService from './auth.service.js';
import { validateBody, validateCookies } from '../../middleware/validate.js';
import {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from './auth.schema.js';
import { setStatus } from '../../middleware/setStatus.js';
import { Request, Response, NextFunction } from 'express';
import { generateAccessToken } from './auth.utils.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { env } from '../../config/env.js';

const refreshAccessHandler = [
    validateCookies(refreshTokenSchema),
    verifyRefreshToken,
    sendAccessToken,
];
const registerHandler = [
    validateBody(registerSchema),
    registerController,
    setRefreshToken,
    setStatus(201),
    sendAccessTokenAndUser,
];
const loginHandler = [
    validateBody(loginSchema),
    loginController,
    setRefreshToken,
    sendAccessTokenAndUser,
];
const logoutHandler = [
    requireAuth,
    validateCookies(refreshTokenSchema),
    logoutController,
];
const googleHandler = [
    passport.authenticate('google', { scope: ['email', 'profile'] }),
];
const googleCallbackHandler = [
    passport.authenticate('google', { session: false }),
    setRefreshToken,
    sendAccessTokenAndUser,
];

async function verifyRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { refreshToken } = res.locals.parsedCookies;
        const user = await authService.validateRefreshToken(refreshToken);
        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
}

function sendAccessToken(req: Request, res: Response) {
    const user = req.user!;
    const accessToken = generateAccessToken(user);
    return res.json({ accessToken });
}

function sendAccessTokenAndUser(req: Request, res: Response) {
    const user = req.user!;
    const accessToken = generateAccessToken(user);
    return res.send(`
        <script>
            window.opener.postMessage(
                ${JSON.stringify({ accessToken, user })},
                '${env.FRONTEND_URL}'
            )
            window.close()
        </script>
    `);
}

async function setRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { id } = req.user!;
        const token = await authService.createRefreshToken(id);
        res.cookie('refreshToken', token, {
            httpOnly: true,
            sameSite: 'strict',
        });
        return next();
    } catch (err) {
        return next(err);
    }
}

async function registerController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { email, password, name } = res.locals.parsedBody;

    try {
        const user = await authService.register(email, password, name);
        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
}

async function loginController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { email, password } = res.locals.parsedBody;

    try {
        const user = await authService.login(email, password);
        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
}

async function logoutController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { refreshToken } = res.locals.parsedCookies;
    const { id } = req.user!;

    try {
        await authService.logout(refreshToken, id);
        return res.sendStatus(204);
    } catch (err) {
        return next(err);
    }
}

export {
    refreshAccessHandler,
    registerHandler,
    loginHandler,
    logoutHandler,
    googleHandler,
    googleCallbackHandler,
};
