import { Router } from "express";
import { Role } from "@prisma/client";
import { getAuditLogByIdController, getAuditLogsController, } from "./audit-log.controller.js";
import { auditLogIdParamsSchema, auditLogListQuerySchema, } from "./audit-log.validation.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
const router = Router();
router.use(requireRole(Role.ADMIN));
router.get("/", validateRequest({
    query: auditLogListQuerySchema,
}), getAuditLogsController);
router.get("/:id", validateRequest({
    params: auditLogIdParamsSchema,
}), getAuditLogByIdController);
export default router;
//# sourceMappingURL=audit-log.routes.js.map