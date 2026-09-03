import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  forgotPasswordController,
  getMe,
  login,
  logout,
  refresh,
  register,
  resendVerification,
  resetPasswordController,
  verifyEmail,
} from "./auth.controller.js";

import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register),
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  asyncHandler(verifyEmail),
);

router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  asyncHandler(resendVerification),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login),
);


router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPasswordController),
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(resetPasswordController),
);


router.post(
  "/refresh",
  validate(refreshTokenSchema),
  asyncHandler(refresh),
);

router.post(
  "/logout",
  validate(logoutSchema),
  asyncHandler(logout),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(getMe),
);

export default router;