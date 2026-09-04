import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  activateAcademicYearController,
  createAcademicYearController,
  deactivateAcademicYearController,
  getAcademicYearByIdController,
  getAcademicYearsController,
  updateAcademicYearController,
} from "./academic-year.controller.js";

import {
  createAcademicYearSchema,
  academicYearListQuerySchema,
  updateAcademicYearSchema,
} from "./academic-year.validation.js";

const router = Router();

router.get(
  "/",
  validate(academicYearListQuerySchema),
  asyncHandler(
    getAcademicYearsController,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getAcademicYearByIdController,
  ),
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createAcademicYearSchema),
  asyncHandler(
    createAcademicYearController,
  ),
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateAcademicYearSchema),
  asyncHandler(
    updateAcademicYearController,
  ),
);

router.patch(
  "/:id/activate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    activateAcademicYearController,
  ),
);

router.patch(
  "/:id/deactivate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deactivateAcademicYearController,
  ),
);

export default router;