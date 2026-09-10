import { sendSuccess } from "../../utils/api-response.js";
import { approveResult, createResult, getResultById, getResults, getStudentCgpa, getStudentSemesterGpa, publishResult, submitResult, updateResult, } from "./result.service.js";
export const createResultController = async (req, res) => {
    const result = await createResult(req.user.userId, req.body);
    return sendSuccess(res, 201, "Result created successfully", result);
};
export const getResultsController = async (req, res) => {
    const result = await getResults(req.user.userId, req.user.role, req.query);
    return sendSuccess(res, 200, "Results retrieved successfully", result);
};
export const getResultByIdController = async (req, res) => {
    const result = await getResultById(req.user.userId, req.user.role, req.params.id);
    return sendSuccess(res, 200, "Result retrieved successfully", result);
};
export const updateResultController = async (req, res) => {
    const result = await updateResult(req.user.userId, req.params.id, req.body);
    return sendSuccess(res, 200, "Result updated successfully", result);
};
export const submitResultController = async (req, res) => {
    const result = await submitResult(req.user.userId, req.params.id);
    return sendSuccess(res, 200, "Result submitted successfully", result);
};
export const approveResultController = async (req, res) => {
    const result = await approveResult(req.params.id);
    return sendSuccess(res, 200, "Result approved successfully", result);
};
export const publishResultController = async (req, res) => {
    const result = await publishResult(req.params.id);
    return sendSuccess(res, 200, "Result published successfully", result);
};
export const getMySemesterGpaController = async (req, res) => {
    const result = await getStudentSemesterGpa(req.user.userId, req.params.semesterId);
    return sendSuccess(res, 200, "Semester GPA calculated successfully", result);
};
export const getMyCgpaController = async (req, res) => {
    const result = await getStudentCgpa(req.user.userId);
    return sendSuccess(res, 200, "CGPA calculated successfully", result);
};
//# sourceMappingURL=result.controller.js.map