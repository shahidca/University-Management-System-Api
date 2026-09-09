import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  approveResult,
  createResult,
  getResultById,
  getResults,
  getStudentCgpa,
  getStudentSemesterGpa,
  publishResult,
  submitResult,
  updateResult,
} from "./result.service.js";

import type {
  CreateResultInput,
  ResultListQueryInput,
  UpdateResultInput,
} from "./result.validation.js";

export const createResultController = async (
  req: Request,
  res: Response,
) => {
  const result = await createResult(
    req.user!.userId,
    req.body as CreateResultInput,
  );

  return sendSuccess(
    res,
    201,
    "Result created successfully",
    result,
  );
};

export const getResultsController = async (
  req: Request,
  res: Response,
) => {
  const result = await getResults(
    req.user!.userId,
    req.user!.role,
    req.query as unknown as ResultListQueryInput,
  );

  return sendSuccess(
    res,
    200,
    "Results retrieved successfully",
    result,
  );
};

export const getResultByIdController = async (
  req: Request,
  res: Response,
) => {
  const result = await getResultById(
    req.user!.userId,
    req.user!.role,
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Result retrieved successfully",
    result,
  );
};

export const updateResultController = async (
  req: Request,
  res: Response,
) => {
  const result = await updateResult(
    req.user!.userId,
    req.params.id as string,
    req.body as UpdateResultInput,
  );

  return sendSuccess(
    res,
    200,
    "Result updated successfully",
    result,
  );
};

export const submitResultController = async (
  req: Request,
  res: Response,
) => {
  const result = await submitResult(
    req.user!.userId,
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Result submitted successfully",
    result,
  );
};

export const approveResultController = async (
  req: Request,
  res: Response,
) => {
  const result = await approveResult(
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Result approved successfully",
    result,
  );
};

export const publishResultController = async (
  req: Request,
  res: Response,
) => {
  const result = await publishResult(
    req.params.id as string,
  );

  return sendSuccess(
    res,
    200,
    "Result published successfully",
    result,
  );
};

export const getMySemesterGpaController = async (
  req: Request,
  res: Response,
) => {
  const result = await getStudentSemesterGpa(
    req.user!.userId,
    req.params.semesterId as string,
  );

  return sendSuccess(
    res,
    200,
    "Semester GPA calculated successfully",
    result,
  );
};

export const getMyCgpaController = async (
  req: Request,
  res: Response,
) => {
  const result = await getStudentCgpa(
    req.user!.userId,
  );

  return sendSuccess(
    res,
    200,
    "CGPA calculated successfully",
    result,
  );
};