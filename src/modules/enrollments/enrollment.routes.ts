import { Router } from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware.js";

import {
  requireRole,
} from "../../middlewares/rbac.middleware.js";

import {
  validateRequest,
} from "../../middlewares/validation.middleware.js";

import {
  createEnrollmentController,
  dropEnrollmentController,
  getEnrollmentByIdController,
  getEnrollmentsController,
  getMyEnrollmentsController,
} from "./enrollment.controller.js";

import {
  createEnrollmentSchema,
  enrollmentListQuerySchema,
} from "./enrollment.validation.js";

const router = Router();

/*
 * Student's own enrollments
 */
router.get(
  "/my",
  authenticate,
  requireRole("STUDENT"),
  validateRequest({
    query:
      enrollmentListQuerySchema,
  }),
  getMyEnrollmentsController,
);

/*
 * Create enrollment
 */
router.post(
  "/",
  authenticate,
  requireRole("STUDENT"),
  validateRequest({
    body: createEnrollmentSchema,
  }),
  createEnrollmentController,
);

/*
 * Admin enrollment listing
 */
router.get(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validateRequest({
    query:
      enrollmentListQuerySchema,
  }),
  getEnrollmentsController,
);

/*
 * Enrollment details
 */
router.get(
  "/:id",
  authenticate,
  getEnrollmentByIdController,
);

/*
 * Student drops their own enrollment
 */
router.patch(
  "/:id/drop",
  authenticate,
  requireRole("STUDENT"),
  dropEnrollmentController,
);

export default router;