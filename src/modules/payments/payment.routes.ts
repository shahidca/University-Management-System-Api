import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";

import {
  getPaymentByIdController,
  getPaymentByTransactionIdController,
  getPaymentsController,
  initiatePaymentController,
} from "./payment.controller.js";

import {
  initiatePaymentSchema,
  paymentIdParamSchema,
  paymentListQuerySchema,
  paymentTransactionParamSchema,
} from "./payment.validation.js";

import reconciliationRoutes from "./payment.reconciliation.routes.js";

const router = Router();

router.use(authenticate);

/*
 * ADMIN payment management
 */

router.get(
  "/",
  requireRole("ADMIN"),
  validateRequest({
    query:
      paymentListQuerySchema,
  }),
  getPaymentsController,
);

router.get(
  "/transaction/:transactionId",
  requireRole("ADMIN"),
  validateRequest({
    params:
      paymentTransactionParamSchema,
  }),
  getPaymentByTransactionIdController,
);

router.get(
  "/:id",
  requireRole("ADMIN"),
  validateRequest({
    params:
      paymentIdParamSchema,
  }),
  getPaymentByIdController,
);

/*
 * Payment initiation.
 *
 * At this stage only ADMIN can initiate
 * a payment record.
 *
 * Later we will add a dedicated
 * STUDENT payment-initiation flow
 * with ownership checks.
 */

router.post(
  "/",
  requireRole("ADMIN"),
  validateRequest({
    body:
      initiatePaymentSchema,
  }),
  initiatePaymentController,
);

router.use(
  "/",
  reconciliationRoutes,
);

export default router;