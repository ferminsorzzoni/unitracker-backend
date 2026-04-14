import passport from "passport";
import { generateAccessToken, generateRefreshToken, getRefreshToken } from "./auth.service.js";

const refreshAccessController = [verifyRefreshToken, sendAccessToken];
const registerController = [register, setRefreshToken, sendAccessToken];
const loginController = [login, setRefreshToken, sendAccessToken];
const googleController = [passport.authenticate("google", { scope: ["email", "profile"]})];
const googleCallbackController = [passport.authenticate("google", { session: false }), setRefreshToken, sendAccessToken];

async function verifyRefreshToken(req, res, next) {
    try {
        const tokenData = await getRefreshToken(req.cookies.refreshToken);
        if(!tokenData) return res.status(401).json({ error: "Unauthorized" });
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

}

async function login(req, res, next) {
// importante setear user
}

export { refreshAccessController, registerController, loginController, googleController, googleCallbackController };