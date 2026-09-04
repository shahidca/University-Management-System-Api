import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
export declare const requireRole: (...allowedRoles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map