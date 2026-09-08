import type {
  RequestHandler,
} from "express";

import type { Role } from "@prisma/client";

import { AppError } from "../utils/app-error.js";

export const authorize = (
  ...allowedRoles: Role[]
): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(
        new AppError(
          "Authentication required",
          401,
        ),
      );

      return;
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      next(
        new AppError(
          "You do not have permission to perform this action",
          403,
        ),
      );

      return;
    }

    next();
  };
};