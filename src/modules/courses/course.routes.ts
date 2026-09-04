import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  activateCourseController,
  createCourseController,
  deactivateCourseController,
  deleteCourseController,
  getCourseByIdController,
  getCoursesController,
  updateCourseController,
} from "./course.controller.js";

import {
  createCourseSchema,
  courseListQuerySchema,
  updateCourseSchema,
} from "./course.validation.js";

const router = Router();

router.get(
  "/",
  validate(courseListQuerySchema),
  asyncHandler(
    getCoursesController,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getCourseByIdController,
  ),
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createCourseSchema),
  asyncHandler(
    createCourseController,
  ),
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateCourseSchema),
  asyncHandler(
    updateCourseController,
  ),
);

router.patch(
  "/:id/activate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    activateCourseController,
  ),
);

router.patch(
  "/:id/deactivate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deactivateCourseController,
  ),
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deleteCourseController,
  ),
);

export default router;