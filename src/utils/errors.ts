interface AppError extends Error {
    status?: number;
}

class BadRequestError extends Error {
    status = 400;

    constructor(message: string) {
        super(message);
    }
}

class UnauthorizedError extends Error {
    status = 401;

    constructor(message: string) {
        super(message);
    }
}

class ForbiddenError extends Error {
    status = 403;

    constructor(message: string) {
        super(message);
    }
}

class NotFoundError extends Error {
    status = 404;
    
    constructor(message: string) {
        super(message);
    }
}

class ConflictError extends Error {
    status = 409;

    constructor(message: string) {
        super(message);
    }
}

class InternalServerError extends Error {
    status = 500;

    constructor(message: string) {
        super(message);
    }
}

export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
};
