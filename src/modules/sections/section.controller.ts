import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  activateSection,
  createSection,
  deactivateSection,
  deleteSection,
  getSectionById,
  getSections,
  updateSection,
} from "./section.service.js";

export const createSectionController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await createSection(req.body);

    sendSuccess(
      res,
      201,
      "Section created successfully",
      result,
    );
  };

export const getSectionsController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getSections(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Sections retrieved successfully",
      result,
    );
  };

export const getSectionByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getSectionById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Section retrieved successfully",
      result,
    );
  };

export const updateSectionController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await updateSection(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Section updated successfully",
      result,
    );
  };

export const activateSectionController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await activateSection(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Section activated successfully",
      result,
    );
  };

export const deactivateSectionController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await deactivateSection(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Section deactivated successfully",
      result,
    );
  };

export const deleteSectionController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteSection(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Section deleted successfully",
      null,
    );
  };