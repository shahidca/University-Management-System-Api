import { sendSuccess } from "../../utils/api-response.js";
import { createCoursePrerequisite, deleteCoursePrerequisite, getCoursePrerequisiteById, getCoursePrerequisites, updateCoursePrerequisite, } from "./course-prerequisite.service.js";
export const createCoursePrerequisiteController = async (req, res) => {
    const result = await createCoursePrerequisite(req.body);
    sendSuccess(res, 201, "Course prerequisite created successfully", result);
};
export const getCoursePrerequisitesController = async (req, res) => {
    const result = await getCoursePrerequisites(req.query);
    sendSuccess(res, 200, "Course prerequisites retrieved successfully", result);
};
export const getCoursePrerequisiteByIdController = async (req, res) => {
    const result = await getCoursePrerequisiteById(req.params.id);
    sendSuccess(res, 200, "Course prerequisite retrieved successfully", result);
};
export const updateCoursePrerequisiteController = async (req, res) => {
    const result = await updateCoursePrerequisite(req.params.id, req.body);
    sendSuccess(res, 200, "Course prerequisite updated successfully", result);
};
export const deleteCoursePrerequisiteController = async (req, res) => {
    await deleteCoursePrerequisite(req.params.id);
    sendSuccess(res, 200, "Course prerequisite deleted successfully", null);
};
//# sourceMappingURL=course-prerequisite.controller.js.map