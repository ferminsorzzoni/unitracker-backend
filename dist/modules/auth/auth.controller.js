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
exports.googleCallbackHandler = exports.googleHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = exports.refreshAccessHandler = void 0;
const passport_1 = __importDefault(require("passport"));
const authService = __importStar(require("./auth.service.js"));
const validate_js_1 = require("../../middleware/validate.js");
const auth_schema_js_1 = require("./auth.schema.js");
const setStatus_js_1 = require("../../middleware/setStatus.js");
const auth_utils_js_1 = require("./auth.utils.js");
const requireAuth_js_1 = require("../../middleware/requireAuth.js");
const env_js_1 = require("../../config/env.js");
const refreshAccessHandler = [
    (0, validate_js_1.validateCookies)(auth_schema_js_1.refreshTokenSchema),
    verifyRefreshToken,
    sendAccessToken,
];
exports.refreshAccessHandler = refreshAccessHandler;
const registerHandler = [
    (0, validate_js_1.validateBody)(auth_schema_js_1.registerSchema),
    registerController,
    setRefreshToken,
    (0, setStatus_js_1.setStatus)(201),
    sendAccessTokenAndUser,
];
exports.registerHandler = registerHandler;
const loginHandler = [
    (0, validate_js_1.validateBody)(auth_schema_js_1.loginSchema),
    loginController,
    setRefreshToken,
    sendAccessTokenAndUser,
];
exports.loginHandler = loginHandler;
const logoutHandler = [
    requireAuth_js_1.requireAuth,
    (0, validate_js_1.validateCookies)(auth_schema_js_1.refreshTokenSchema),
    logoutController,
];
exports.logoutHandler = logoutHandler;
const googleHandler = [
    passport_1.default.authenticate('google', { scope: ['email', 'profile'] }),
];
exports.googleHandler = googleHandler;
const googleCallbackHandler = [
    passport_1.default.authenticate('google', { session: false }),
    setRefreshToken,
    sendAccessTokenAndUserRedirect,
];
exports.googleCallbackHandler = googleCallbackHandler;
async function verifyRefreshToken(req, res, next) {
    try {
        const { refreshToken } = res.locals.parsedCookies;
        const user = await authService.validateRefreshToken(refreshToken);
        req.user = user;
        return next();
    }
    catch (err) {
        return next(err);
    }
}
function sendAccessToken(req, res) {
    const user = req.user;
    const accessToken = (0, auth_utils_js_1.generateAccessToken)(user);
    return res.json({ accessToken });
}
function sendAccessTokenAndUser(req, res) {
    const user = req.user;
    const accessToken = (0, auth_utils_js_1.generateAccessToken)(user);
    return res.json({ accessToken, user });
}
function sendAccessTokenAndUserRedirect(req, res) {
    const user = req.user;
    const accessToken = (0, auth_utils_js_1.generateAccessToken)(user);
    const params = encodeURIComponent(JSON.stringify({ accessToken, user }));
    return res.redirect(`${env_js_1.env.FRONTEND_URL}/auth/callback?data=${params}`);
}
async function setRefreshToken(req, res, next) {
    try {
        const { id } = req.user;
        const token = await authService.createRefreshToken(id);
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: env_js_1.env.NODE_ENV === "production",
            sameSite: env_js_1.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function registerController(req, res, next) {
    const { email, password, name } = res.locals.parsedBody;
    try {
        const user = await authService.register(email, password, name);
        req.user = user;
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function loginController(req, res, next) {
    const { email, password } = res.locals.parsedBody;
    try {
        const user = await authService.login(email, password);
        req.user = user;
        return next();
    }
    catch (err) {
        return next(err);
    }
}
async function logoutController(req, res, next) {
    const { refreshToken } = res.locals.parsedCookies;
    const { id } = req.user;
    try {
        await authService.logout(refreshToken, id);
        res.clearCookie("refreshToken");
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}
