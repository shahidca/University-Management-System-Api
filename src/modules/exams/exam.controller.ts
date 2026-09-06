import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  publishExam,
  unpublishExam,
  updateExam,
} from "./exam.service.js";

import type {
  CreateExamInput,
  ExamListQueryInput,
  UpdateExamInput,
} from "./exam.validation.js";

export const createExamController = async (
  req: Request,
  res: Response,
) => {
  const exam = await createExam(
    req.user!.userId,
    req.body as CreateExamInput,
  );

  return sendSuccess(
    res,
    201,
    "Exam created successfully",
    exam,
  );
};

export const getExamsController = async (
  req: Request,
  res: Response,
) => {
  const result = await getExams(
    req.query as unknown as ExamListQueryInput,
  );

  return sendSuccess(
    res,
    200,
    "Exams retrieved successfully",
    result,
  );
};

export const getExamByIdController = async (
  req: Request,
  res: Response,
) => {
  const exam = await getExamById(
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Exam retrieved successfully",
    exam,
  );
};

export const updateExamController = async (
  req: Request,
  res: Response,
) => {
  const exam = await updateExam(
    req.user!.userId,
    req.params.id as string,
    req.body as UpdateExamInput,
  );

  return sendSuccess(
    res,
    200,
    "Exam updated successfully",
    exam,
  );
};

export const publishExamController = async (
  req: Request,
  res: Response,
) => {
  const exam = await publishExam(
    req.user!.userId,
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Exam published successfully",
    exam,
  );
};

export const unpublishExamController = async (
  req: Request,
  res: Response,
) => {
  const exam = await unpublishExam(
    req.user!.userId,
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Exam unpublished successfully",
    exam,
  );
};

export const deleteExamController = async (
  req: Request,
  res: Response,
) => {
  const result = await deleteExam(
    req.user!.userId,
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Exam deleted successfully",
    result,
  );
};