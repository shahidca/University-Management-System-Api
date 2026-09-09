import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  cancelInvoice,
  createInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "./invoice.service.js";

export const createInvoiceController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const invoice =
        await createInvoice(
          req.body,
        );

      return sendSuccess(
        res,
        201,
        "Invoice created successfully",
        invoice,
      );
    },
  );

export const getInvoicesController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getInvoices(
          req.query as never,
        );

      return sendSuccess(
        res,
        200,
        "Invoices retrieved successfully",
        result,
      );
    },
  );

export const getInvoiceByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const invoice =
        await getInvoiceById(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Invoice retrieved successfully",
        invoice,
      );
    },
  );

export const updateInvoiceController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const invoice =
        await updateInvoice(
          req.params.id as string,
          req.body,
        );

      return sendSuccess(
        res,
        200,
        "Invoice updated successfully",
        invoice,
      );
    },
  );

export const cancelInvoiceController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const invoice =
        await cancelInvoice(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Invoice cancelled successfully",
        invoice,
      );
    },
  );