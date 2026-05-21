"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_js_1 = require("./subject.controller.js");
const subjectRouter = (0, express_1.Router)();
subjectRouter.post('/', subject_controller_js_1.createSubjectHandler);
subjectRouter.patch('/:subjectId', subject_controller_js_1.updateSubjectHandler);
subjectRouter.delete('/:subjectId', subject_controller_js_1.deleteSubjectHandler);
exports.default = subjectRouter;
