import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const [scheme, token] = authorization.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    throw new AppError(
      "Invalid authorization header",
      401,
    );
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role as import("@prisma/client").Role,
    };

    next();
  } catch {
    throw new AppError(
      "Invalid or expired access token",
      401,
    );
  }
};