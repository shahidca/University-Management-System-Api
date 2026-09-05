import type { RequestHandler } from "express";
import type { ZodType } from "zod";
interface ValidationSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}
export declare const validate: (schema: ZodType) => RequestHandler;
export declare const validateRequest: (schemas: ValidationSchemas) => RequestHandler;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map