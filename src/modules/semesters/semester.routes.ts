import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  activateSemesterController,
  closeRegistrationController,
  completeSemesterController,
  createSemesterController,
  getSemesterByIdController,
  getSemestersController,
  openRegistrationController,
  updateSemesterController,
} from "./semester.controller.js";

import {
  createSemesterSchema,
  semesterListQuerySchema,
  updateSemesterSchema,
} from "./semester.validation.js";

const router = Router();

router.get(
  "/",
  validate(semesterListQuerySchema),
  asyncHandler(
    getSemestersController,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getSemesterByIdController,
  ),
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createSemesterSchema),
  asyncHandler(
    createSemesterController,
  ),
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateSemesterSchema),
  asyncHandler(
    updateSemesterController,
  ),
);

router.patch(
  "/:id/open-registration",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    openRegistrationController,
  ),
);

router.patch(
  "/:id/close-registration",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    closeRegistrationController,
  ),
);

router.patch(
  "/:id/activate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    activateSemesterController,
  ),
);

router.patch(
  "/:id/complete",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    completeSemesterController,
  ),
);

export default router;