import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  getPaymentById,
  getPaymentByTransactionId,
  getPayments,
  initiatePayment,
} from "./payment.service.js";

export const initiatePaymentController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const payment =
await initiatePayment(
  req.body,
  req.user!.userId,
);

      return sendSuccess(
        res,
        201,
        "Payment initiated successfully",
        payment,
      );
    },
  );

export const getPaymentsController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getPayments(
          req.query as never,
        );

      return sendSuccess(
        res,
        200,
        "Payments retrieved successfully",
        result,
      );
    },
  );

export const getPaymentByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const payment =
        await getPaymentById(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Payment retrieved successfully",
        payment,
      );
    },
  );

export const getPaymentByTransactionIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const payment =
        await getPaymentByTransactionId(
          req.params.transactionId as string,
        );

      return sendSuccess(
        res,
        200,
        "Payment retrieved successfully",
        payment,
      );
    },
  );

