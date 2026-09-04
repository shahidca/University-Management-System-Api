import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  activateCourse,
  createCourse,
  deactivateCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "./course.service.js";

export const createCourseController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const course =
      await createCourse(req.body);

    sendSuccess(
      res,
      201,
      "Course created successfully",
      course,
    );
  };

export const getCoursesController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getCourses(
        req.query as never,
      );

    sendSuccess(
      res,
      200,
      "Courses retrieved successfully",
      result,
    );
  };

export const getCourseByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const course =
      await getCourseById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course retrieved successfully",
      course,
    );
  };

export const updateCourseController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const course =
      await updateCourse(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Course updated successfully",
      course,
    );
  };

export const activateCourseController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const course =
      await activateCourse(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course activated successfully",
      course,
    );
  };

export const deactivateCourseController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const course =
      await deactivateCourse(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Course deactivated successfully",
      course,
    );
  };

export const deleteCourseController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteCourse(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Course deleted successfully",
      null,
    );
  };