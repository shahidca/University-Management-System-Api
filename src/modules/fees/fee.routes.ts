import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";

import {
  createFeeController,
  deleteFeeController,
  getFeeByIdController,
  getFeesController,
  updateFeeController,
} from "./fee.controller.js";

import {
  createFeeSchema,
  feeIdParamSchema,
  feeListQuerySchema,
  updateFeeSchema,
} from "./fee.validation.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN"));

router.post(
  "/",
  validateRequest({
    body: createFeeSchema,
  }),
  createFeeController,
);

router.get(
  "/",
  validateRequest({
    query: feeListQuerySchema,
  }),
  getFeesController,
);

router.get(
  "/:id",
  validateRequest({
    params: feeIdParamSchema,
  }),
  getFeeByIdController,
);

router.patch(
  "/:id",
  validateRequest({
    params: feeIdParamSchema,
    body: updateFeeSchema,
  }),
  updateFeeController,
);

router.delete(
  "/:id",
  validateRequest({
    params: feeIdParamSchema,
  }),
  deleteFeeController,
);

export default router;