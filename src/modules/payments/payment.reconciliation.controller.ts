import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  reconcilePayment,
} from "./payment.reconciliation.service.js";

export const reconcilePaymentController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await reconcilePayment(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        result.changed
          ? "Payment reconciled successfully"
          : "Payment is already reconciled",
        result,
      );
    },
  );