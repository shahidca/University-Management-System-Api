import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";

import {
  deleteMyNotification,
  getMyNotificationById,
  getMyNotifications,
  getMyUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.service.js";

export const getMyNotificationsController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getMyNotifications(
          req.user!.userId,
          req.query as unknown as Parameters<
            typeof getMyNotifications
          >[1],
        );

      return sendSuccess(
        res,
        200,
        "Notifications retrieved successfully",
        result,
      );
    },
  );

export const getMyUnreadCountController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await getMyUnreadCount(
          req.user!.userId,
        );

      return sendSuccess(
        res,
        200,
        "Unread notification count retrieved successfully",
        result,
      );
    },
  );

export const getMyNotificationByIdController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const notification =
        await getMyNotificationById(
          req.user!.userId,
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Notification retrieved successfully",
        notification,
      );
    },
  );

export const markNotificationAsReadController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const notification =
        await markNotificationAsRead(
          req.user!.userId,
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Notification marked as read",
        notification,
      );
    },
  );

export const markAllNotificationsAsReadController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await markAllNotificationsAsRead(
          req.user!.userId,
        );

      return sendSuccess(
        res,
        200,
        "All notifications marked as read",
        result,
      );
    },
  );

export const deleteMyNotificationController =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const result =
        await deleteMyNotification(
          req.user!.userId,
          req.params.id as string,
        );

      return sendSuccess(
        res,
        200,
        "Notification deleted successfully",
        result,
      );
    },
  );