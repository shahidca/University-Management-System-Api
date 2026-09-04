import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  activateCourseOfferingController,
  createCourseOfferingController,
  deactivateCourseOfferingController,
  deleteCourseOfferingController,
  getCourseOfferingByIdController,
  getCourseOfferingsController,
  updateCourseOfferingController,
} from "./course-offering.controller.js";

import {
  createCourseOfferingSchema,
  courseOfferingListQuerySchema,
  updateCourseOfferingSchema,
} from "./course-offering.validation.js";

const router = Router();

router.get(
  "/",
  validate(
    courseOfferingListQuerySchema,
  ),
  asyncHandler(
    getCourseOfferingsController,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getCourseOfferingByIdController,
  ),
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(
    createCourseOfferingSchema,
  ),
  asyncHandler(
    createCourseOfferingController,
  ),
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(
    updateCourseOfferingSchema,
  ),
  asyncHandler(
    updateCourseOfferingController,
  ),
);

router.patch(
  "/:id/activate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    activateCourseOfferingController,
  ),
);

router.patch(
  "/:id/deactivate",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deactivateCourseOfferingController,
  ),
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deleteCourseOfferingController,
  ),
);

export default router;