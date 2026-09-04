import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  createCoursePrerequisite,
  deleteCoursePrerequisite,
  getCoursePrerequisiteById,
  getCoursePrerequisites,
  updateCoursePrerequisite,
} from "./course-prerequisite.service.js";

export const createCoursePrerequisiteController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await createCoursePrerequisite(
        req.body,
      );

    sendSuccess(
      res,
      201,
      "Course prerequisite created successfully",
      result,
    );
  };

export const getCoursePrerequisitesController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getCoursePrerequisites(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Course prerequisites retrieved successfully",
      result,
    );
  };

export const getCoursePrerequisiteByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getCoursePrerequisiteById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course prerequisite retrieved successfully",
      result,
    );
  };

export const updateCoursePrerequisiteController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await updateCoursePrerequisite(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Course prerequisite updated successfully",
      result,
    );
  };

export const deleteCoursePrerequisiteController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteCoursePrerequisite(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Course prerequisite deleted successfully",
      null,
    );
  };