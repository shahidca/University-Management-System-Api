import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  createDepartmentController,
  deleteDepartmentController,
  getDepartmentByIdController,
  getDepartmentsController,
  updateDepartmentController,
} from "./department.controller.js";

import {
  createDepartmentSchema,
  departmentListQuerySchema,
  updateDepartmentSchema,
} from "./department.validation.js";

const router = Router();

/*
 * Public/authenticated read access.
 */
router.get(
  "/",
  validate(departmentListQuerySchema),
  asyncHandler(
    getDepartmentsController,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getDepartmentByIdController,
  ),
);

/*
 * ADMIN-only management.
 */
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validate(createDepartmentSchema),
  asyncHandler(
    createDepartmentController,
  ),
);

router.patch(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  validate(updateDepartmentSchema),
  asyncHandler(
    updateDepartmentController,
  ),
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(
    deleteDepartmentController,
  ),
);

export default router;