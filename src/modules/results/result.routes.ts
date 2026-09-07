import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  getMyCgpaController,
} from "./result.controller.js";
import {
  getMySemesterGpaController,
} from "./result.controller.js";
import {
  approveResultController,
  createResultController,
  getResultByIdController,
  getResultsController,
  publishResultController,
  submitResultController,
  updateResultController,
} from "./result.controller.js";

import {
  createResultSchema,
  resultListQuerySchema,
  updateResultSchema,
} from "./result.validation.js";

const router = Router();

/**
 * GET /api/v1/results
 *
 * Retrieve results.
 */
router.get(
  "/",
  authenticate,
  validateRequest({
    query: resultListQuerySchema,
  }),
  asyncHandler(
    getResultsController,
  ),
);

/**
 * GET /api/v1/results/:id
 *
 * Retrieve a single result.
 */
router.get(
  "/:id",
  authenticate,
  asyncHandler(
    getResultByIdController,
  ),
);

/**
 * POST /api/v1/results
 *
 * Instructor creates a draft result.
 */
router.post(
  "/",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: createResultSchema,
  }),
  asyncHandler(
    createResultController,
  ),
);

/**
 * PATCH /api/v1/results/:id
 *
 * Instructor can update only DRAFT results.
 */
router.patch(
  "/:id",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: updateResultSchema,
  }),
  asyncHandler(
    updateResultController,
  ),
);

/**
 * PATCH /api/v1/results/:id/submit
 *
 * Instructor submits a draft result.
 */
router.patch(
  "/:id/submit",
  authenticate,
  requireRole("INSTRUCTOR"),
  asyncHandler(
    submitResultController,
  ),
);

/**
 * PATCH /api/v1/results/:id/approve
 *
 * Admin approves a submitted result.
 */
router.patch(
  "/:id/approve",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    approveResultController,
  ),
);

/**
 * PATCH /api/v1/results/:id/publish
 *
 * Admin publishes an approved result.
 */
router.patch(
  "/:id/publish",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    publishResultController,
  ),
);

router.get(
  "/my/semester/:semesterId/gpa",
  authenticate,
  requireRole("STUDENT"),
  asyncHandler(
    getMySemesterGpaController,
  ),
);

router.get(
  "/my/cgpa",
  authenticate,
  requireRole("STUDENT"),
  asyncHandler(
    getMyCgpaController,
  ),
);

export default router;