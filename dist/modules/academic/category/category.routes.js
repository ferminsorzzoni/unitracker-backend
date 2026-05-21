"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_js_1 = require("./category.controller.js");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/', category_controller_js_1.createCategoryHandler);
categoryRouter.patch('/:categoryId', category_controller_js_1.updateCategoryHandler);
categoryRouter.delete('/:categoryId', category_controller_js_1.deleteCategoryHandler);
exports.default = categoryRouter;
