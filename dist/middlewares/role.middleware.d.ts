import type { RequestHandler } from "express";
import type { Role } from "@prisma/client";
export declare const authorize: (...allowedRoles: Role[]) => RequestHandler;
//# sourceMappingURL=role.middleware.d.ts.map