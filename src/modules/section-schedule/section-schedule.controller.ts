import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

import {
  createSectionSchedule,
  deleteSectionSchedule,
  getSectionScheduleById,
  getSectionSchedules,
  updateSectionSchedule,
} from "./section-schedule.service.js";

import type {
  CreateSectionScheduleInput,
  SectionScheduleListQueryInput,
  UpdateSectionScheduleInput,
} from "./section-schedule.validation.js";

export const createSectionScheduleController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const schedule =
        await createSectionSchedule(
          req.body as CreateSectionScheduleInput,
        );

      sendSuccess(
        res,
        201,
        "Section schedule created successfully",
        schedule,
      );
    },
  );

export const getSectionSchedulesController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getSectionSchedules(
          req.query as unknown as SectionScheduleListQueryInput,
        );

      sendSuccess(
        res,
        200,
        "Section schedules retrieved successfully",
        result,
      );
    },
  );

export const getSectionScheduleByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const schedule =
        await getSectionScheduleById(
          req.params.id as string,
        );

      sendSuccess(
        res,
        200,
        "Section schedule retrieved successfully",
        schedule,
      );
    },
  );

export const updateSectionScheduleController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const schedule =
        await updateSectionSchedule(
          req.params.id as string,
          req.body as UpdateSectionScheduleInput,
        );

      sendSuccess(
        res,
        200,
        "Section schedule updated successfully",
        schedule,
      );
    },
  );

export const deleteSectionScheduleController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await deleteSectionSchedule(
          req.params.id as string,
        );

      sendSuccess(
        res,
        200,
        "Section schedule deleted successfully",
        result,
      );
    },
  );