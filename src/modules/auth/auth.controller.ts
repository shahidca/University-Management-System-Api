import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  resendVerificationOtp,
  resetPassword,
  verifyUserEmail,
} from "./auth.service.js";

import type {
  ForgotPasswordSchemaInput,
  LoginSchemaInput,
  LogoutSchemaInput,
  RefreshTokenSchemaInput,
  RegisterSchemaInput,
  ResendVerificationSchemaInput,
  ResetPasswordSchemaInput,
  VerifyEmailSchemaInput,
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

export const refresh = async (
  req: Request,
  res: Response,
) => {
  const result = await refreshUserToken(
    req.body as RefreshTokenSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "Access token refreshed successfully",
    result,
  );
};

export const logout = async (
  req: Request,
  res: Response,
) => {
  await logoutUser(
    req.body as LogoutSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "Logout successful",
    null,
  );
};

export const getMe = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new Error(
      "Authenticated user context is missing",
    );
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

export const verifyEmail = async (
  req: Request,
  res: Response,
) => {
  const user = await verifyUserEmail(
    req.body as VerifyEmailSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "Email verified successfully",
    user,
  );
};

export const resendVerification = async (
  req: Request,
  res: Response,
) => {
  await resendVerificationOtp(
    req.body as ResendVerificationSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "If the account exists and is not verified, a new verification code has been sent",
    null,
  );
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
) => {
  await forgotPassword(
    req.body as ForgotPasswordSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "If the account exists and is eligible, a password reset code has been sent",
    null,
  );
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
) => {
  await resetPassword(
    req.body as ResetPasswordSchemaInput,
  );

  return sendSuccess(
    res,
    200,
    "Password reset successfully. Please log in again",
    null,
  );
};