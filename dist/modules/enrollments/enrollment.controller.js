import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { createEnrollment, dropEnrollment, getEnrollmentById, getEnrollments, getMyEnrollments, } from "./enrollment.service.js";
export const createEnrollmentController = asyncHandler(async (req, res) => {
    const enrollment = await createEnrollment(req.user.userId, req.body);
    sendSuccess(res, 201, "Enrollment created successfully", enrollment);
});
export const getMyEnrollmentsController = asyncHandler(async (req, res) => {
    const result = await getMyEnrollments(req.user.userId, req.query);
    sendSuccess(res, 200, "Your enrollments retrieved successfully", result);
});
export const getEnrollmentsController = asyncHandler(async (req, res) => {
    const result = await getEnrollments(req.query);
    sendSuccess(res, 200, "Enrollments retrieved successfully", result);
});
export const getEnrollmentByIdController = asyncHandler(async (req, res) => {
    const enrollment = await getEnrollmentById(req.params.id);
    sendSuccess(res, 200, "Enrollment retrieved successfully", enrollment);
});
export const dropEnrollmentController = asyncHandler(async (req, res) => {
    const enrollment = await dropEnrollment(req.user.userId, req.params.id);
    sendSuccess(res, 200, "Enrollment dropped successfully", enrollment);
});
//# sourceMappingURL=enrollment.controller.js.map