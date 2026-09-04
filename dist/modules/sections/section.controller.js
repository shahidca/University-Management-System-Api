import { sendSuccess } from "../../utils/api-response.js";
import { activateSection, createSection, deactivateSection, deleteSection, getSectionById, getSections, updateSection, } from "./section.service.js";
export const createSectionController = async (req, res) => {
    const result = await createSection(req.body);
    sendSuccess(res, 201, "Section created successfully", result);
};
export const getSectionsController = async (req, res) => {
    const result = await getSections(req.query);
    sendSuccess(res, 200, "Sections retrieved successfully", result);
};
export const getSectionByIdController = async (req, res) => {
    const result = await getSectionById(req.params.id);
    sendSuccess(res, 200, "Section retrieved successfully", result);
};
export const updateSectionController = async (req, res) => {
    const result = await updateSection(req.params.id, req.body);
    sendSuccess(res, 200, "Section updated successfully", result);
};
export const activateSectionController = async (req, res) => {
    const result = await activateSection(req.params.id);
    sendSuccess(res, 200, "Section activated successfully", result);
};
export const deactivateSectionController = async (req, res) => {
    const result = await deactivateSection(req.params.id);
    sendSuccess(res, 200, "Section deactivated successfully", result);
};
export const deleteSectionController = async (req, res) => {
    await deleteSection(req.params.id);
    sendSuccess(res, 200, "Section deleted successfully", null);
};
//# sourceMappingURL=section.controller.js.map