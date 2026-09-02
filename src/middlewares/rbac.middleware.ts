import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";

import { AppError } from "../utils/app-error.js";

export const requireRole = (
  ...allowedRoles: Role[]
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401,
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    next();
  };
};