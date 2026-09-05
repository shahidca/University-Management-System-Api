import type { Request, Response } from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  createAttendance,
  deleteAttendance,
  getAttendanceById,
  getAttendanceSummary,
  getAttendances,
  getMyAttendance,
  updateAttendance,
} from "./attendance.service.js";

import type {
  AttendanceListQueryInput,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "./attendance.validation.js";

export const createAttendanceController = async (
  req: Request,
  res: Response,
) => {
  const attendance = await createAttendance(
    req.user!.userId,
    req.body as CreateAttendanceInput,
  );

  return sendSuccess(
    res,
    201,
    "Attendance marked successfully",
    attendance,
  );
};

export const getAttendancesController = async (
  req: Request,
  res: Response,
) => {
  const result = await getAttendances(
    req.query as unknown as AttendanceListQueryInput,
  );

  return sendSuccess(
    res,
    200,
    "Attendance records retrieved successfully",
    result,
  );
};

export const getAttendanceByIdController =
  async (
    req: Request,
    res: Response,
  ) => {
    const attendance =
      await getAttendanceById(
        req.params.id as string,
      );

    return sendSuccess(
      res,
      200,
      "Attendance record retrieved successfully",
      attendance,
    );
  };

export const updateAttendanceController =
  async (
    req: Request,
    res: Response,
  ) => {
    const attendance =
      await updateAttendance(
        req.user!.userId,
        req.params.id as string,
        req.body as UpdateAttendanceInput,
      );

    return sendSuccess(
      res,
      200,
      "Attendance updated successfully",
      attendance,
    );
  };

export const deleteAttendanceController =
  async (
    req: Request,
    res: Response,
  ) => {
    const result =
      await deleteAttendance(
        req.user!.userId,
        req.params.id as string,
      );

    return sendSuccess(
      res,
      200,
      "Attendance deleted successfully",
      result,
    );
  };

export const getMyAttendanceController =
  async (
    req: Request,
    res: Response,
  ) => {
    const result =
      await getMyAttendance(
        req.user!.userId,
        req.query as unknown as AttendanceListQueryInput,
      );

    return sendSuccess(
      res,
      200,
      "Your attendance records retrieved successfully",
      result,
    );
  };

export const getAttendanceSummaryController =
  async (
    req: Request,
    res: Response,
  ) => {
    const summary =
      await getAttendanceSummary(
        req.params.enrollmentId as string,
      );

    return sendSuccess(
      res,
      200,
      "Attendance summary retrieved successfully",
      summary,
    );
  };