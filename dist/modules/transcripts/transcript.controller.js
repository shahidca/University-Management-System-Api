import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { approveTranscript, generateSemesterTranscript, getMyIssuedTranscripts, getTranscriptById, getTranscripts, issueTranscript, revokeTranscript, } from "./transcript.service.js";
import { getStudentAcademicHistory, } from "./transcript.history.js";
import { getStudentCourseHistory, } from "./transcript.course-history.js";
import { getStudentTranscripts, } from "./transcript.service.js";
export const generateSemesterTranscriptController = asyncHandler(async (req, res) => {
    const transcript = await generateSemesterTranscript(req.user.userId, req.params.semesterId);
    return sendSuccess(res, 201, "Semester transcript generated successfully", transcript);
});
export const getTranscriptByIdController = asyncHandler(async (req, res) => {
    const transcript = await getTranscriptById(req.user.userId, req.user.role, req.params.id);
    return sendSuccess(res, 200, "Transcript retrieved successfully", transcript);
});
export const getTranscriptsController = asyncHandler(async (req, res) => {
    const result = await getTranscripts(req.user.userId, req.user.role, req.query);
    return sendSuccess(res, 200, "Transcripts retrieved successfully", result);
});
export const approveTranscriptController = asyncHandler(async (req, res) => {
    const transcript = await approveTranscript(req.params.id, req.user.userId, req.ip, req.get("user-agent") ?? undefined);
    return sendSuccess(res, 200, "Transcript approved successfully", transcript);
});
export const issueTranscriptController = asyncHandler(async (req, res) => {
    const transcript = await issueTranscript(req.params.id, req.user.userId, req.ip, req.get("user-agent") ?? undefined);
    return sendSuccess(res, 200, "Transcript issued successfully", transcript);
});
export const revokeTranscriptController = asyncHandler(async (req, res) => {
    const transcript = await revokeTranscript(req.params.id, req.user.userId, req.ip, req.get("user-agent") ?? undefined);
    return sendSuccess(res, 200, "Transcript revoked successfully", transcript);
});
export const getStudentAcademicHistoryController = asyncHandler(async (req, res) => {
    const history = await getStudentAcademicHistory(req.user.userId);
    return sendSuccess(res, 200, "Academic history retrieved successfully", history);
});
export const getStudentCourseHistoryController = asyncHandler(async (req, res) => {
    const history = await getStudentCourseHistory(req.user.userId);
    return sendSuccess(res, 200, "Student course history retrieved successfully", history);
});
export const getMyIssuedTranscriptsController = asyncHandler(async (req, res) => {
    const transcripts = await getMyIssuedTranscripts(req.user.userId);
    return sendSuccess(res, 200, "Issued transcripts retrieved successfully", transcripts);
});
export const getStudentTranscriptsController = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId;
    const query = req.query;
    const result = await getStudentTranscripts(studentId, query);
    return sendSuccess(res, 200, "Student transcripts retrieved successfully", result);
});
//# sourceMappingURL=transcript.controller.js.map