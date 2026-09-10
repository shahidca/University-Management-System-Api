import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { cancelInvoice, createInvoice, getInvoiceById, getInvoices, updateInvoice, } from "./invoice.service.js";
export const createInvoiceController = asyncHandler(async (req, res) => {
    const invoice = await createInvoice(req.body);
    return sendSuccess(res, 201, "Invoice created successfully", invoice);
});
export const getInvoicesController = asyncHandler(async (req, res) => {
    const result = await getInvoices(req.query);
    return sendSuccess(res, 200, "Invoices retrieved successfully", result);
});
export const getInvoiceByIdController = asyncHandler(async (req, res) => {
    const invoice = await getInvoiceById(req.params.id);
    return sendSuccess(res, 200, "Invoice retrieved successfully", invoice);
});
export const updateInvoiceController = asyncHandler(async (req, res) => {
    const invoice = await updateInvoice(req.params.id, req.body);
    return sendSuccess(res, 200, "Invoice updated successfully", invoice);
});
export const cancelInvoiceController = asyncHandler(async (req, res) => {
    const invoice = await cancelInvoice(req.params.id);
    return sendSuccess(res, 200, "Invoice cancelled successfully", invoice);
});
//# sourceMappingURL=invoice.controller.js.map