import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createSectionSchedule, deleteSectionSchedule, getSectionScheduleById, getSectionSchedules, updateSectionSchedule, } from "./section-schedule.service.js";
export const createSectionScheduleController = asyncHandler(async (req, res) => {
    const schedule = await createSectionSchedule(req.body);
    sendSuccess(res, 201, "Section schedule created successfully", schedule);
});
export const getSectionSchedulesController = asyncHandler(async (req, res) => {
    const result = await getSectionSchedules(req.query);
    sendSuccess(res, 200, "Section schedules retrieved successfully", result);
});
export const getSectionScheduleByIdController = asyncHandler(async (req, res) => {
    const schedule = await getSectionScheduleById(req.params.id);
    sendSuccess(res, 200, "Section schedule retrieved successfully", schedule);
});
export const updateSectionScheduleController = asyncHandler(async (req, res) => {
    const schedule = await updateSectionSchedule(req.params.id, req.body);
    sendSuccess(res, 200, "Section schedule updated successfully", schedule);
});
export const deleteSectionScheduleController = asyncHandler(async (req, res) => {
    const result = await deleteSectionSchedule(req.params.id);
    sendSuccess(res, 200, "Section schedule deleted successfully", result);
});
//# sourceMappingURL=section-schedule.controller.js.map