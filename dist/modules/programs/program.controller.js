import { sendSuccess } from "../../utils/api-response.js";
import { createProgram, deleteProgram, getProgramById, getPrograms, updateProgram, } from "./program.service.js";
export const createProgramController = async (req, res) => {
    const program = await createProgram(req.body);
    sendSuccess(res, 201, "Program created successfully", program);
};
export const getProgramsController = async (req, res) => {
    const result = await getPrograms(req.query);
    sendSuccess(res, 200, "Programs retrieved successfully", result);
};
export const getProgramByIdController = async (req, res) => {
    const program = await getProgramById(req.params.id);
    sendSuccess(res, 200, "Program retrieved successfully", program);
};
export const updateProgramController = async (req, res) => {
    const program = await updateProgram(req.params.id, req.body);
    sendSuccess(res, 200, "Program updated successfully", program);
};
export const deleteProgramController = async (req, res) => {
    await deleteProgram(req.params.id);
    sendSuccess(res, 200, "Program deleted successfully", null);
};
//# sourceMappingURL=program.controller.js.map