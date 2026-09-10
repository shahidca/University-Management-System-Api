import { Router } from "express";

import {
  reconcilePaymentController,
} from "./payment.reconciliation.controller.js";

import {
  reconcilePaymentParamsSchema,
} from "./payment.reconciliation.validation.js";

import { validateRequest } from "../../middlewares/validation.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/:id/reconcile",
  requireRole(Role.ADMIN),
  validateRequest({
    params:
      reconcilePaymentParamsSchema,
  }),
  reconcilePaymentController,
);

export default router;