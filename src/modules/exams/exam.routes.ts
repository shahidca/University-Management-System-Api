import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  createExamController,
  deleteExamController,
  getExamByIdController,
  getExamsController,
  publishExamController,
  unpublishExamController,
  updateExamController,
} from "./exam.controller.js";

import {
  createExamSchema,
  examListQuerySchema,
  updateExamSchema,
} from "./exam.validation.js";

const router = Router();

/**
 * GET /api/v1/exams
 *
 * Retrieve exams with pagination,
 * filtering, searching and sorting.
 */
router.get(
  "/",
  authenticate,
  validateRequest({
    query: examListQuerySchema,
  }),
  asyncHandler(
    getExamsController,
  ),
);

/**
 * GET /api/v1/exams/:id
 *
 * Retrieve a single exam.
 */
router.get(
  "/:id",
  authenticate,
  asyncHandler(
    getExamByIdController,
  ),
);

/**
 * POST /api/v1/exams
 *
 * Create an exam for an instructor's section.
 */
router.post(
  "/",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: createExamSchema,
  }),
  asyncHandler(
    createExamController,
  ),
);

/**
 * PATCH /api/v1/exams/:id
 *
 * Update an unpublished exam.
 */
router.patch(
  "/:id",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: updateExamSchema,
  }),
  asyncHandler(
    updateExamController,
  ),
);

/**
 * PATCH /api/v1/exams/:id/publish
 *
 * Publish an exam.
 */
router.patch(
  "/:id/publish",
  authenticate,
  requireRole("INSTRUCTOR"),
  asyncHandler(
    publishExamController,
  ),
);

/**
 * PATCH /api/v1/exams/:id/unpublish
 *
 * Unpublish an exam.
 */
router.patch(
  "/:id/unpublish",
  authenticate,
  requireRole("INSTRUCTOR"),
  asyncHandler(
    unpublishExamController,
  ),
);

/**
 * DELETE /api/v1/exams/:id
 *
 * Delete an unpublished exam
 * that has no results.
 */
router.delete(
  "/:id",
  authenticate,
  requireRole("INSTRUCTOR"),
  asyncHandler(
    deleteExamController,
  ),
);

export default router;