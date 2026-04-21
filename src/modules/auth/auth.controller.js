import passport from "passport";
import { generateAccessToken, generateRefreshToken, getRefreshToken, loginService, logoutService, registerService } from "./auth.service.js";
import { validateBody, validateCookies } from "../../middleware/validate.js";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schema.js";

const refreshAccessController = [validateCookies(refreshTokenSchema),verifyRefreshToken, sendAccessToken];
const registerController = [validateBody(registerSchema), register, setRefreshToken, sendAccessToken];
const loginController = [validateBody(loginSchema), login, setRefreshToken, sendAccessToken];
const logoutController = [validateCookies(refreshTokenSchema), logout];
const googleController = [passport.authenticate("google", { scope: ["email", "profile"]})];
const googleCallbackController = [passport.authenticate("google", { session: false }), setRefreshToken, sendAccessToken];

async function verifyRefreshToken(req, res, next) {
    try {
        const tokenData = await getRefreshToken(req.cookies.refreshToken);
        req.user = { id: tokenData.userId };
        next();
    } catch(err) {
        next(err);
    }
}

function sendAccessToken(req, res) {
    const token = generateAccessToken(req.user.id);
    return res.json({ token });
}

async function setRefreshToken(req, res, next) {
    try {
        const token = await generateRefreshToken(req.user.id);
        res.cookie("refreshToken", token, { httpOnly: true, sameSite: "strict" });
        next();
    } catch(err) {
        next(err);
    }
}

async function register(req, res, next) {
    const { email, password, name } = req.body;

    try {
        const user = await registerService(email, password, name);
        req.user = { id: user.id };
        next();
    } catch(err) {
        next(err);
    }

}

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await loginService(email, password);
        req.user = {id: user.id };
        next();
    } catch(err) {
        next(err);
    }
}

async function logout(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    try {
        await logoutService(refreshToken);
        res.json({ message: "Logged out successfully" });
    } catch(err) {
        next(err);
    }
}

export { refreshAccessController, registerController, loginController, logoutController, googleController, googleCallbackController };