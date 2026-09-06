import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  approveResult,
  createResult,
  getResultById,
  getResults,
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