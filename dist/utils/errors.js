"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    status = 400;
    constructor(message) {
        super(message);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    status = 401;
    constructor(message) {
        super(message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    status = 403;
    constructor(message) {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends Error {
    status = 404;
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends Error {
    status = 409;
    constructor(message) {
        super(message);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends Error {
    status = 500;
    constructor(message) {
        super(message);
    }
}
exports.InternalServerError = InternalServerError;
