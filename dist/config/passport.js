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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_js_1 = require("./env.js");
const userRepository = __importStar(require("./../modules/auth/user.repository.js"));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: env_js_1.env.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (jwt_payload, done) => {
    try {
        const user = await userRepository.findById(jwt_payload.sub);
        if (user)
            return done(null, { id: user.id, role: user.role });
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_js_1.env.GOOGLE_CLIENT_ID,
    clientSecret: env_js_1.env.GOOGLE_CLIENT_SECRET,
    callbackURL: env_js_1.env.BASE_URL + '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email)
            throw new Error('Email not provided');
        let user = await userRepository.findByGoogleId(profile.id);
        if (!user) {
            user = await userRepository.create({
                googleId: profile.id,
                email: email,
                name: profile.displayName,
            });
        }
        return cb(null, { id: user.id, role: user.role, email: user.email });
    }
    catch (err) {
        return cb(err);
    }
}));
