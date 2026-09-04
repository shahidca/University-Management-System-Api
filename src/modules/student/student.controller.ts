import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";
import {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} from "./student.service.js";

export const createStudentProfileController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    const studentProfile =
      await createStudentProfile(
        userId,
        req.body,
      );

    sendSuccess(
      res,
      201,
      "Student profile created successfully",
      studentProfile,
    );
  };

  export const getStudentProfileController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    const studentProfile =
      await getStudentProfile(userId);

    sendSuccess(
      res,
      200,
      "Student profile retrieved successfully",
      studentProfile,
    );
  };

  export const updateStudentProfileController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    const studentProfile =
      await updateStudentProfile(
        userId,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Student profile updated successfully",
      studentProfile,
    );
  };