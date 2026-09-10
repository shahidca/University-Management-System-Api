import { Router } from "express";

import {
  sslCommerzCancelController,
  sslCommerzFailController,
  sslCommerzIpnController,
  sslCommerzSuccessController,
} from "./payment.webhook.controller.js";

const router = Router();

/**
 * Authoritative SSLCommerz server-to-server notification.
 *
 * This endpoint performs:
 * - SSLCommerz validation
 * - amount verification
 * - currency verification
 * - transaction verification
 * - risk handling
 * - payment state transition
 * - invoice reconciliation
 */
router.post(
  "/ipn",
  sslCommerzIpnController,
);

/**
 * Browser/server callback only.
 *
 * Never trust this endpoint for payment success.
 */
router.post(
  "/success",
  sslCommerzSuccessController,
);

/**
 * Browser/server failure callback only.
 */
router.post(
  "/fail",
  sslCommerzFailController,
);

/**
 * Browser/server cancellation callback only.
 */
router.post(
  "/cancel",
  sslCommerzCancelController,
);

export default router;