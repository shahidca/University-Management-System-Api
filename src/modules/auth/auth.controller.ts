import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./auth.service.js";

import type {
  LoginSchemaInput,
  RegisterSchemaInput,
} from "./auth.validation.js";

export const register = async (
  req: Request,
  res: Response,
) => {
  const user = await registerUser(
    req.body as RegisterSchemaInput,
  );

  return sendSuccess(
    res,
    201,
    "User registered successfully",
    user,
  );
};

export const login = async (
  req: Request,
  res: Response,
) => {
  const result = await loginUser(
    req.body as LoginSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "Login successful",
    result,
  );
};

export const getMe = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new Error("Authenticated user context is missing");
  }

  const user = await getCurrentUser(
    req.user.userId,
  );

  return sendSuccess(
    res,
    200,
    "Current user retrieved successfully",
    user,
  );
};