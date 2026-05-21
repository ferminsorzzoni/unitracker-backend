"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategory_controller_1 = require("./subcategory.controller");
const subcategoryRouter = (0, express_1.Router)();
subcategoryRouter.post('/', subcategory_controller_1.createSubcategoryHandler);
subcategoryRouter.patch('/:subcategoryId', subcategory_controller_1.updateSubcategoryHandler);
subcategoryRouter.delete('/:subcategoryId', subcategory_controller_1.deleteSubcategoryHandler);
exports.default = subcategoryRouter;
