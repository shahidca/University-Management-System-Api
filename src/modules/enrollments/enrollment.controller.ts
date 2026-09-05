import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  createEnrollment,
  dropEnrollment,
  getEnrollmentById,
  getEnrollments,
  getMyEnrollments,
} from "./enrollment.service.js";

import type {
  CreateEnrollmentInput,
  EnrollmentListQueryInput,
} from "./enrollment.validation.js";

export const createEnrollmentController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const enrollment =
        await createEnrollment(
          req.user!.userId,
          req.body as CreateEnrollmentInput,
        );

      sendSuccess(
        res,
        201,
        "Enrollment created successfully",
        enrollment,
      );
    },
  );

export const getMyEnrollmentsController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getMyEnrollments(
          req.user!.userId,
          req.query as unknown as EnrollmentListQueryInput,
        );

      sendSuccess(
        res,
        200,
        "Your enrollments retrieved successfully",
        result,
      );
    },
  );

export const getEnrollmentsController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getEnrollments(
          req.query as unknown as EnrollmentListQueryInput,
        );

      sendSuccess(
        res,
        200,
        "Enrollments retrieved successfully",
        result,
      );
    },
  );

export const getEnrollmentByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const enrollment =
        await getEnrollmentById(
          req.params.id as string,
        );

      sendSuccess(
        res,
        200,
        "Enrollment retrieved successfully",
        enrollment,
      );
    },
  );

export const dropEnrollmentController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const enrollment =
        await dropEnrollment(
          req.user!.userId,
          req.params.id as string,
        );

      sendSuccess(
        res,
        200,
        "Enrollment dropped successfully",
        enrollment,
      );
    },
  );