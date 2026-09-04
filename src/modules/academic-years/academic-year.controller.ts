import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  activateAcademicYear,
  createAcademicYear,
  deactivateAcademicYear,
  getAcademicYearById,
  getAcademicYears,
  updateAcademicYear,
} from "./academic-year.service.js";

export const createAcademicYearController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const academicYear =
      await createAcademicYear(
        req.body,
      );

    sendSuccess(
      res,
      201,
      "Academic year created successfully",
      academicYear,
    );
  };

export const getAcademicYearsController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getAcademicYears(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Academic years retrieved successfully",
      result,
    );
  };

export const getAcademicYearByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const academicYear =
      await getAcademicYearById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Academic year retrieved successfully",
      academicYear,
    );
  };

export const updateAcademicYearController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const academicYear =
      await updateAcademicYear(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Academic year updated successfully",
      academicYear,
    );
  };

export const activateAcademicYearController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const academicYear =
      await activateAcademicYear(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Academic year activated successfully",
      academicYear,
    );
  };

export const deactivateAcademicYearController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const academicYear =
      await deactivateAcademicYear(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Academic year deactivated successfully",
      academicYear,
    );
  };