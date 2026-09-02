import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";
export const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues,
        });
        return;
    }
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
        });
        return;
    }
    console.error("Unexpected error:", error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        errors: [],
    });
};
//# sourceMappingURL=error.middleware.js.map