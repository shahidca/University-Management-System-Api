import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { createFee, deleteFee, getFeeById, getFees, updateFee, } from "./fee.service.js";
export const createFeeController = asyncHandler(async (req, res) => {
    const fee = await createFee(req.body);
    return sendSuccess(res, 201, "Fee created successfully", fee);
});
export const getFeesController = asyncHandler(async (req, res) => {
    const result = await getFees(req.query);
    return sendSuccess(res, 200, "Fees retrieved successfully", result);
});
export const getFeeByIdController = asyncHandler(async (req, res) => {
    const fee = await getFeeById(req.params.id);
    return sendSuccess(res, 200, "Fee retrieved successfully", fee);
});
export const updateFeeController = asyncHandler(async (req, res) => {
    const fee = await updateFee(req.params.id, req.body);
    return sendSuccess(res, 200, "Fee updated successfully", fee);
});
export const deleteFeeController = asyncHandler(async (req, res) => {
    await deleteFee(req.params.id);
    return sendSuccess(res, 200, "Fee deleted successfully", null);
});
//# sourceMappingURL=fee.controller.js.map