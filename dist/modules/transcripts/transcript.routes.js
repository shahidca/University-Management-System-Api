import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { approveTranscriptController, generateSemesterTranscriptController, getMyIssuedTranscriptsController, getStudentAcademicHistoryController, getStudentCourseHistoryController, getStudentTranscriptsController, getTranscriptByIdController, getTranscriptsController, issueTranscriptController, revokeTranscriptController, } from "./transcript.controller.js";
import { transcriptIdParamsSchema, transcriptListQuerySchema, transcriptSemesterParamsSchema, transcriptStudentParamsSchema, } from "./transcript.validation.js";
const router = Router();
router.use(authenticate);
router.get("/", authorize("STUDENT", "ADMIN"), validateRequest({
    query: transcriptListQuerySchema,
}), getTranscriptsController);
router.get("/:id", authorize("STUDENT", "ADMIN"), validateRequest({
    params: transcriptIdParamsSchema,
}), getTranscriptByIdController);
router.post("/semester/:semesterId/generate", authorize("STUDENT"), validateRequest({
    params: transcriptSemesterParamsSchema,
}), generateSemesterTranscriptController);
router.patch("/:id/approve", authorize("ADMIN"), validateRequest({
    params: transcriptIdParamsSchema,
}), approveTranscriptController);
router.patch("/:id/issue", authorize("ADMIN"), validateRequest({
    params: transcriptIdParamsSchema,
}), issueTranscriptController);
router.get("/my/issued", authorize("STUDENT"), getMyIssuedTranscriptsController);
router.patch("/:id/revoke", authorize("ADMIN"), validateRequest({
    params: transcriptIdParamsSchema,
}), revokeTranscriptController);
router.get("/my/academic-history", authorize("STUDENT"), getStudentAcademicHistoryController);
router.get("/my/course-history", authorize("STUDENT"), getStudentCourseHistoryController);
router.get("/student/:studentId", authorize("ADMIN"), validateRequest({
    params: transcriptStudentParamsSchema,
    query: transcriptListQuerySchema,
}), getStudentTranscriptsController);
export default router;
//# sourceMappingURL=transcript.routes.js.map