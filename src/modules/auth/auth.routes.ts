import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  getMe,
  login,
  register,
} from "./auth.controller.js";

import {
  loginSchema,
  registerSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(getMe),
);

export default router;