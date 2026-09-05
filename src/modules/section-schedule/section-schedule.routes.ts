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
  validate,
} from "../../middlewares/validation.middleware.js";

import {
  createSectionScheduleController,
  deleteSectionScheduleController,
  getSectionScheduleByIdController,
  getSectionSchedulesController,
  updateSectionScheduleController,
} from "./section-schedule.controller.js";

import {
  createSectionScheduleSchema,
  sectionScheduleListQuerySchema,
  updateSectionScheduleSchema,
} from "./section-schedule.validation.js";

const router = Router();

router.get(
  "/",
  validateRequest({
    query:
      sectionScheduleListQuerySchema,
  }),
  getSectionSchedulesController,
);

router.get(
  "/:id",
  getSectionScheduleByIdController,
);

router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(
    createSectionScheduleSchema,
  ),
  createSectionScheduleController,
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(
    updateSectionScheduleSchema,
  ),
  updateSectionScheduleController,
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  deleteSectionScheduleController,
);

export default router;