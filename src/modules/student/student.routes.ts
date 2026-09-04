import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  createStudentProfileController,
  getStudentProfileController,
  updateStudentProfileController,
} from "./student.controller.js";

import {
  createStudentProfileSchema,
  updateStudentProfileSchema,
} from "./student.validation.js";

const router = Router();

router.post(
  "/profile",
  authenticate,
  requireRole("STUDENT"),
  validate(createStudentProfileSchema),
  asyncHandler(
    createStudentProfileController,
  ),
);

router.get(
  "/profile",
  authenticate,
  requireRole("STUDENT"),
  asyncHandler(
    getStudentProfileController,
  ),
);

router.patch(
  "/profile",
  authenticate,
  requireRole("STUDENT"),
  validate(updateStudentProfileSchema),
  asyncHandler(
    updateStudentProfileController,
  ),
);

export default router;