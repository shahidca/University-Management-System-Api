export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errors: unknown[];
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, errors?: unknown[], isOperational?: boolean);
}
//# sourceMappingURL=app-error.d.ts.map