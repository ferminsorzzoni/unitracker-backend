"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const passport_1 = __importDefault(require("passport"));
function requireAuth(req, res, next) {
    return passport_1.default.authenticate('jwt', { session: false })(req, res, next);
}
