import { sendSuccess } from "../../utils/api-response.js";
import { activateCourseOffering, createCourseOffering, deactivateCourseOffering, deleteCourseOffering, getCourseOfferingById, getCourseOfferings, updateCourseOffering, } from "./course-offering.service.js";
export const createCourseOfferingController = async (req, res) => {
    const result = await createCourseOffering(req.body);
    sendSuccess(res, 201, "Course offering created successfully", result);
};
export const getCourseOfferingsController = async (req, res) => {
    const result = await getCourseOfferings(req.query);
    sendSuccess(res, 200, "Course offerings retrieved successfully", result);
};
export const getCourseOfferingByIdController = async (req, res) => {
    const result = await getCourseOfferingById(req.params.id);
    sendSuccess(res, 200, "Course offering retrieved successfully", result);
};
export const updateCourseOfferingController = async (req, res) => {
    const result = await updateCourseOffering(req.params.id, req.body);
    sendSuccess(res, 200, "Course offering updated successfully", result);
};
export const activateCourseOfferingController = async (req, res) => {
    const result = await activateCourseOffering(req.params.id);
    sendSuccess(res, 200, "Course offering activated successfully", result);
};
export const deactivateCourseOfferingController = async (req, res) => {
    const result = await deactivateCourseOffering(req.params.id);
    sendSuccess(res, 200, "Course offering deactivated successfully", result);
};
export const deleteCourseOfferingController = async (req, res) => {
    await deleteCourseOffering(req.params.id);
    sendSuccess(res, 200, "Course offering deleted successfully", null);
};
//# sourceMappingURL=course-offering.controller.js.map