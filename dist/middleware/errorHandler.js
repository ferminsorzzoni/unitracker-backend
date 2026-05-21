"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, req, res, _next) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
}
