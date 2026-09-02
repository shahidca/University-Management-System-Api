export class AppError extends Error {
    statusCode;
    errors;
    isOperational;
    constructor(message, statusCode = 500, errors = [], isOperational = true) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
//# sourceMappingURL=app-error.js.map