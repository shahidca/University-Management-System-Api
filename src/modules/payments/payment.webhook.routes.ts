import { Router } from "express";
import {
  sslCommerzIpnController,
} from "./payment.webhook.controller.js";

const router = Router();

router.post(
  "/ipn",
  sslCommerzIpnController,
);

router.post(
  "/success",
  sslCommerzIpnController,
);

router.post(
  "/fail",
  sslCommerzIpnController,
);

router.post(
  "/cancel",
  sslCommerzIpnController,
);

export default router;