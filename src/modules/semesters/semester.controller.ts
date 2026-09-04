import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  activateSemester,
  closeSemesterRegistration,
  completeSemester,
  createSemester,
  getSemesterById,
  getSemesters,
  openSemesterRegistration,
  updateSemester,
} from "./semester.service.js";

export const createSemesterController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await createSemester(
        req.body,
      );

    sendSuccess(
      res,
      201,
      "Semester created successfully",
      semester,
    );
  };

export const getSemestersController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getSemesters(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Semesters retrieved successfully",
      result,
    );
  };

export const getSemesterByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await getSemesterById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Semester retrieved successfully",
      semester,
    );
  };

export const updateSemesterController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await updateSemester(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Semester updated successfully",
      semester,
    );
  };

export const openRegistrationController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await openSemesterRegistration(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Semester registration opened successfully",
      semester,
    );
  };

export const closeRegistrationController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await closeSemesterRegistration(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Semester registration closed successfully",
      semester,
    );
  };

export const activateSemesterController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await activateSemester(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Semester activated successfully",
      semester,
    );
  };

export const completeSemesterController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const semester =
      await completeSemester(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Semester completed successfully",
      semester,
    );
  };