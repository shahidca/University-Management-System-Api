import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  updateProgram,
} from "./program.service.js";

export const createProgramController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const program =
      await createProgram(req.body);

    sendSuccess(
      res,
      201,
      "Program created successfully",
      program,
    );
  };

export const getProgramsController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await getPrograms(
      req.query as never,
    );

    sendSuccess(
      res,
      200,
      "Programs retrieved successfully",
      result,
    );
  };

export const getProgramByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const program =
      await getProgramById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Program retrieved successfully",
      program,
    );
  };

export const updateProgramController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const program =
      await updateProgram(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Program updated successfully",
      program,
    );
  };

export const deleteProgramController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteProgram(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Program deleted successfully",
      null,
    );
  };