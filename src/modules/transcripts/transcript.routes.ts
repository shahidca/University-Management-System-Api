import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";

import {
  approveTranscriptController,
  generateSemesterTranscriptController,
  getMyIssuedTranscriptsController,
  getStudentAcademicHistoryController,
  getStudentCourseHistoryController,
  getTranscriptByIdController,
  getTranscriptsController,
  issueTranscriptController,
  revokeTranscriptController,
} from "./transcript.controller.js";

import {
  transcriptIdParamsSchema,
  transcriptListQuerySchema,
  transcriptSemesterParamsSchema,
} from "./transcript.validation.js";


const router = Router();

router.use(authenticate);

router.get(
  "/",
  validateRequest({
    query: transcriptListQuerySchema,
  }),
  getTranscriptsController,
);

router.get(
  "/:id",
  validateRequest({
    params: transcriptIdParamsSchema,
  }),
  getTranscriptByIdController,
);

router.post(
  "/semester/:semesterId/generate",
  authorize("STUDENT"),
  validateRequest({
    params: transcriptSemesterParamsSchema,
  }),
  generateSemesterTranscriptController,
);

router.patch(
  "/:id/approve",
  authorize("ADMIN"),
  validateRequest({
    params: transcriptIdParamsSchema,
  }),
  approveTranscriptController,
);

router.patch(
  "/:id/issue",
  authorize("ADMIN"),
  validateRequest({
    params: transcriptIdParamsSchema,
  }),
  issueTranscriptController,
);

router.get(
  "/my/issued",
  authorize("STUDENT"),
  getMyIssuedTranscriptsController,
);

router.patch(
  "/:id/revoke",
  authorize("ADMIN"),
  validateRequest({
    params: transcriptIdParamsSchema,
  }),
  revokeTranscriptController,
);

router.get(
  "/my/academic-history",
  authorize("STUDENT"),
  getStudentAcademicHistoryController,
);

router.get(
  "/my/course-history",
  authorize("STUDENT"),
  getStudentCourseHistoryController,
);


export default router;