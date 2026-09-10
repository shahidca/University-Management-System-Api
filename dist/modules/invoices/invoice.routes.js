import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { cancelInvoiceController, createInvoiceController, getInvoiceByIdController, getInvoicesController, updateInvoiceController, } from "./invoice.controller.js";
import { createInvoiceSchema, invoiceIdParamSchema, invoiceListQuerySchema, updateInvoiceSchema, } from "./invoice.validation.js";
const router = Router();
router.use(authenticate);
router.use(requireRole("ADMIN"));
router.post("/", validateRequest({
    body: createInvoiceSchema,
}), createInvoiceController);
router.get("/", validateRequest({
    query: invoiceListQuerySchema,
}), getInvoicesController);
router.get("/:id", validateRequest({
    params: invoiceIdParamSchema,
}), getInvoiceByIdController);
router.patch("/:id", validateRequest({
    params: invoiceIdParamSchema,
    body: updateInvoiceSchema,
}), updateInvoiceController);
router.post("/:id/cancel", validateRequest({
    params: invoiceIdParamSchema,
}), cancelInvoiceController);
export default router;
//# sourceMappingURL=invoice.routes.js.map