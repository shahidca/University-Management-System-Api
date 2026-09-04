import type {
  Request,
  Response,
} from "express";

import { sendSuccess } from "../../utils/api-response.js";

import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "./department.service.js";

export const createDepartmentController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const department =
      await createDepartment(req.body);

    sendSuccess(
      res,
      201,
      "Department created successfully",
      department,
    );
  };

export const getDepartmentsController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result =
      await getDepartments(req.query as never);

    sendSuccess(
      res,
      200,
      "Departments retrieved successfully",
      result,
    );
  };

export const getDepartmentByIdController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const department =
      await getDepartmentById(
        req.params.id as string,
      );

    sendSuccess(
      res,
      200,
      "Department retrieved successfully",
      department,
    );
  };

export const updateDepartmentController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const department =
      await updateDepartment(
        req.params.id as string,
        req.body,
      );

    sendSuccess(
      res,
      200,
      "Department updated successfully",
      department,
    );
  };

export const deleteDepartmentController =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await deleteDepartment(
      req.params.id as string,
    );

    sendSuccess(
      res,
      200,
      "Department deleted successfully",
      null,
    );
  };