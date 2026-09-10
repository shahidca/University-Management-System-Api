import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  getAuditLogById,
  getAuditLogs,
} from "./audit-log.service.js";

export const getAuditLogsController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getAuditLogs(
          req.query as unknown as Parameters<
            typeof getAuditLogs
          >[0],
        );

      return sendSuccess(
        res,
        200,
        "Audit logs retrieved successfully",
        result,
      );
    },
  );

export const getAuditLogByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const auditLog =
        await getAuditLogById(
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Audit log retrieved successfully",
        auditLog,
      );
    },
  );