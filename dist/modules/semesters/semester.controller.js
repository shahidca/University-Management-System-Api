import { sendSuccess } from "../../utils/api-response.js";
import { activateSemester, closeSemesterRegistration, completeSemester, createSemester, getSemesterById, getSemesters, openSemesterRegistration, updateSemester, } from "./semester.service.js";
export const createSemesterController = async (req, res) => {
    const semester = await createSemester(req.body);
    sendSuccess(res, 201, "Semester created successfully", semester);
};
export const getSemestersController = async (req, res) => {
    const result = await getSemesters(req.query);
    sendSuccess(res, 200, "Semesters retrieved successfully", result);
};
export const getSemesterByIdController = async (req, res) => {
    const semester = await getSemesterById(req.params.id);
    sendSuccess(res, 200, "Semester retrieved successfully", semester);
};
export const updateSemesterController = async (req, res) => {
    const semester = await updateSemester(req.params.id, req.body);
    sendSuccess(res, 200, "Semester updated successfully", semester);
};
export const openRegistrationController = async (req, res) => {
    const semester = await openSemesterRegistration(req.params.id);
    sendSuccess(res, 200, "Semester registration opened successfully", semester);
};
export const closeRegistrationController = async (req, res) => {
    const semester = await closeSemesterRegistration(req.params.id);
    sendSuccess(res, 200, "Semester registration closed successfully", semester);
};
export const activateSemesterController = async (req, res) => {
    const semester = await activateSemester(req.params.id);
    sendSuccess(res, 200, "Semester activated successfully", semester);
};
export const completeSemesterController = async (req, res) => {
    const semester = await completeSemester(req.params.id);
    sendSuccess(res, 200, "Semester completed successfully", semester);
};
//# sourceMappingURL=semester.controller.js.map