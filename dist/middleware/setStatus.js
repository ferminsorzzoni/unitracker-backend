"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStatus = setStatus;
function setStatus(code) {
    return function (req, res, next) {
        res.status(code);
        return next();
    };
}
