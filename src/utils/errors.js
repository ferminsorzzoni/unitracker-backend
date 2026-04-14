class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}

export { ConflictError, UnauthorizedError };