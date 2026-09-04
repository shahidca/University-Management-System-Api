import { sendSuccess } from "../../utils/api-response.js";
import { activateAcademicYear, createAcademicYear, deactivateAcademicYear, getAcademicYearById, getAcademicYears, updateAcademicYear, } from "./academic-year.service.js";
export const createAcademicYearController = async (req, res) => {
    const academicYear = await createAcademicYear(req.body);
    sendSuccess(res, 201, "Academic year created successfully", academicYear);
};
export const getAcademicYearsController = async (req, res) => {
    const result = await getAcademicYears(req.query);
    sendSuccess(res, 200, "Academic years retrieved successfully", result);
};
export const getAcademicYearByIdController = async (req, res) => {
    const academicYear = await getAcademicYearById(req.params.id);
    sendSuccess(res, 200, "Academic year retrieved successfully", academicYear);
};
export const updateAcademicYearController = async (req, res) => {
    const academicYear = await updateAcademicYear(req.params.id, req.body);
    sendSuccess(res, 200, "Academic year updated successfully", academicYear);
};
export const activateAcademicYearController = async (req, res) => {
    const academicYear = await activateAcademicYear(req.params.id);
    sendSuccess(res, 200, "Academic year activated successfully", academicYear);
};
export const deactivateAcademicYearController = async (req, res) => {
    const academicYear = await deactivateAcademicYear(req.params.id);
    sendSuccess(res, 200, "Academic year deactivated successfully", academicYear);
};
//# sourceMappingURL=academic-year.controller.js.map