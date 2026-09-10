import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { getAuditLogById, getAuditLogs, } from "./audit-log.service.js";
export const getAuditLogsController = asyncHandler(async (req, res) => {
    const result = await getAuditLogs(req.query);
    return sendSuccess(res, 200, "Audit logs retrieved successfully", result);
});
export const getAuditLogByIdController = asyncHandler(async (req, res) => {
    const auditLog = await getAuditLogById(req.params.id);
    return sendSuccess(res, 200, "Audit log retrieved successfully", auditLog);
});
//# sourceMappingURL=audit-log.controller.js.map