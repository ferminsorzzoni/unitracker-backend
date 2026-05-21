"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./config/passport.js");
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const academic_routes_js_1 = __importDefault(require("./modules/academic/academic.routes.js"));
const errorHandler_js_1 = __importDefault(require("./middleware/errorHandler.js"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://tu-frontend.onrender.com'],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/academic', academic_routes_js_1.default);
app.use(errorHandler_js_1.default);
exports.default = app;
