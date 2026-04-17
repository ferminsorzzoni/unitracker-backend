class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

export { BadRequestError, UnauthorizedError, ConflictError };