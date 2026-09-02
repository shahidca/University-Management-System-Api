import { Router } from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
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

export default router;