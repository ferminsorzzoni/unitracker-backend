"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const career_routes_js_1 = __importDefault(require("./career/career.routes.js"));
const category_routes_js_1 = __importDefault(require("./category/category.routes.js"));
const subcategory_routes_js_1 = __importDefault(require("./subcategory/subcategory.routes.js"));
const subject_routes_js_1 = __importDefault(require("./subject/subject.routes.js"));
const prerequisite_routes_js_1 = __importDefault(require("./prerequisite/prerequisite.routes.js"));
const academicRouter = (0, express_1.Router)();
academicRouter.use('/careers', career_routes_js_1.default);
academicRouter.use('/categories', category_routes_js_1.default);
academicRouter.use('/subcategories', subcategory_routes_js_1.default);
academicRouter.use('/subjects', subject_routes_js_1.default);
academicRouter.use('/prerequisites', prerequisite_routes_js_1.default);
exports.default = academicRouter;
