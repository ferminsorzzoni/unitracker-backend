"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../../config/env.js");
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user.id, role: user.role, email: user.email }, env_js_1.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}
