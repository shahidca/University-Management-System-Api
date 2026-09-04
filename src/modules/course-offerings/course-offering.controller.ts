import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  activateCourseOffering,
  createCourseOffering,
  deactivateCourseOffering,
  deleteCourseOffering,
  getCourseOfferingById,
  getCourseOfferings,
  updateCourseOffering,
} from "./course-offering.service.js";

export const createCourseOfferingController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await createCourseOffering(
        req.body,
      );

    sendSuccess(
      res,
      201,
      "Course offering created successfully",
      result,
    );
  };

export const getCourseOfferingsController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getCourseOfferings(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Course offerings retrieved successfully",
      result,
    );
  };

export const getCourseOfferingByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getCourseOfferingById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course offering retrieved successfully",
      result,
    );
  };

export const updateCourseOfferingController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await updateCourseOffering(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Course offering updated successfully",
      result,
    );
  };

export const activateCourseOfferingController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await activateCourseOffering(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course offering activated successfully",
      result,
    );
  };

export const deactivateCourseOfferingController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await deactivateCourseOffering(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course offering deactivated successfully",
      result,
    );
  };

export const deleteCourseOfferingController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteCourseOffering(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Course offering deleted successfully",
      null,
    );
  };