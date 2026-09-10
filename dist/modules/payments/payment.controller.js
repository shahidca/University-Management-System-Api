import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { getPaymentById, getPaymentByTransactionId, getPayments, initiatePayment, } from "./payment.service.js";
export const initiatePaymentController = asyncHandler(async (req, res) => {
    const payment = await initiatePayment(req.body, req.user.userId);
    return sendSuccess(res, 201, "Payment initiated successfully", payment);
});
export const getPaymentsController = asyncHandler(async (req, res) => {
    const result = await getPayments(req.query);
    return sendSuccess(res, 200, "Payments retrieved successfully", result);
});
export const getPaymentByIdController = asyncHandler(async (req, res) => {
    const payment = await getPaymentById(req.params.id);
    return sendSuccess(res, 200, "Payment retrieved successfully", payment);
});
export const getPaymentByTransactionIdController = asyncHandler(async (req, res) => {
    const payment = await getPaymentByTransactionId(req.params.transactionId);
    return sendSuccess(res, 200, "Payment retrieved successfully", payment);
});
//# sourceMappingURL=payment.controller.js.map