import passport from "passport";
import { generateAccessToken, generateRefreshToken, getRefreshToken, loginService, registerService } from "./auth.service.js";

const refreshAccessController = [verifyRefreshToken, sendAccessToken];
const registerController = [validateRegisterCredentials, register, setRefreshToken, sendAccessToken];
const loginController = [login, setRefreshToken, sendAccessToken];
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

function validateRegisterCredentials(req, res, next) {

}

async function register(req, res, next) {
    const { email, password, name } = req.body;

    try {
        const user = await registerService(email, password, name);
        req.user = user;
        next();
    } catch(err) {
        next(err);
    }

}

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await loginService(email, password);
        req.user = user;
        next();
    } catch(err) {
        next(err);
    }
}

export { refreshAccessController, registerController, loginController, googleController, googleCallbackController };