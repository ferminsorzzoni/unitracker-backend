"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prerequisite_controller_js_1 = require("./prerequisite.controller.js");
const prerequisiteRouter = (0, express_1.Router)();
prerequisiteRouter.post('/', prerequisite_controller_js_1.createPrerequisiteHandler);
prerequisiteRouter.delete('/:prerequisiteId', prerequisite_controller_js_1.deletePrerequisiteHandler);
exports.default = prerequisiteRouter;
