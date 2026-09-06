import { sendSuccess } from "../../utils/api-response.js";
import { createAttendance, deleteAttendance, getAttendanceById, getAttendanceSummary, getAttendances, getMyAttendance, updateAttendance, } from "./attendance.service.js";
export const createAttendanceController = async (req, res) => {
    const attendance = await createAttendance(req.user.userId, req.body);
    return sendSuccess(res, 201, "Attendance marked successfully", attendance);
};
export const getAttendancesController = async (req, res) => {
    const result = await getAttendances(req.query);
    return sendSuccess(res, 200, "Attendance records retrieved successfully", result);
};
export const getAttendanceByIdController = async (req, res) => {
    const attendance = await getAttendanceById(req.params.id);
    return sendSuccess(res, 200, "Attendance record retrieved successfully", attendance);
};
export const updateAttendanceController = async (req, res) => {
    const attendance = await updateAttendance(req.user.userId, req.params.id, req.body);
    return sendSuccess(res, 200, "Attendance updated successfully", attendance);
};
export const deleteAttendanceController = async (req, res) => {
    const result = await deleteAttendance(req.user.userId, req.params.id);
    return sendSuccess(res, 200, "Attendance deleted successfully", result);
};
export const getMyAttendanceController = async (req, res) => {
    const result = await getMyAttendance(req.user.userId, req.query);
    return sendSuccess(res, 200, "Your attendance records retrieved successfully", result);
};
export const getAttendanceSummaryController = async (req, res) => {
    const summary = await getAttendanceSummary(req.params.enrollmentId);
    return sendSuccess(res, 200, "Attendance summary retrieved successfully", summary);
};
//# sourceMappingURL=attendance.controller.js.map