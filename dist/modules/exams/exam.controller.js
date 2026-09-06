import { sendSuccess } from "../../utils/api-response.js";
import { createExam, deleteExam, getExamById, getExams, publishExam, unpublishExam, updateExam, } from "./exam.service.js";
export const createExamController = async (req, res) => {
    const exam = await createExam(req.user.userId, req.body);
    return sendSuccess(res, 201, "Exam created successfully", exam);
};
export const getExamsController = async (req, res) => {
    const result = await getExams(req.query);
    return sendSuccess(res, 200, "Exams retrieved successfully", result);
};
export const getExamByIdController = async (req, res) => {
    const exam = await getExamById(req.params.id);
    return sendSuccess(res, 200, "Exam retrieved successfully", exam);
};
export const updateExamController = async (req, res) => {
    const exam = await updateExam(req.user.userId, req.params.id, req.body);
    return sendSuccess(res, 200, "Exam updated successfully", exam);
};
export const publishExamController = async (req, res) => {
    const exam = await publishExam(req.user.userId, req.params.id);
    return sendSuccess(res, 200, "Exam published successfully", exam);
};
export const unpublishExamController = async (req, res) => {
    const exam = await unpublishExam(req.user.userId, req.params.id);
    return sendSuccess(res, 200, "Exam unpublished successfully", exam);
};
export const deleteExamController = async (req, res) => {
    const result = await deleteExam(req.user.userId, req.params.id);
    return sendSuccess(res, 200, "Exam deleted successfully", result);
};
//# sourceMappingURL=exam.controller.js.map