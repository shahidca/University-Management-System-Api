import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  createFee,
  deleteFee,
  getFeeById,
  getFees,
  updateFee,
} from "./fee.service.js";

export const createFeeController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const fee =
        await createFee(req.body);

      return sendSuccess(
        res,
        201,
        "Fee created successfully",
        fee,
      );
    },
  );

export const getFeesController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getFees(req.query as never);

      return sendSuccess(
        res,
        200,
        "Fees retrieved successfully",
        result,
      );
    },
  );

export const getFeeByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const fee =
        await getFeeById(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Fee retrieved successfully",
        fee,
      );
    },
  );

export const updateFeeController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const fee =
        await updateFee(
          req.params.id as string,
          req.body,
        );

      return sendSuccess(
        res,
        200,
        "Fee updated successfully",
        fee,
      );
    },
  );

export const deleteFeeController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      await deleteFee(
        req.params.id as string,
      );

      return sendSuccess(
        res,
        200,
        "Fee deleted successfully",
        null,
      );
    },
  );