import {
  NotificationType,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateNotificationInput,
  NotificationListQuery,
} from "./notification.types.js";


const notificationSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  message: true,
  isRead: true,
  readAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.NotificationSelect;

export const createNotification = async (
  input: CreateNotificationInput,
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
      },
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      ...(input.metadata !== undefined
        ? {
            metadata:
              input.metadata,
          }
        : {}),
    },
    select: notificationSelect,
  });
};

export const getMyNotifications = async (
  userId: string,
  query: NotificationListQuery,
) => {
  const {
    page,
    limit,
    type,
    isRead,
    search,
    sortOrder,
  } = query;

  const where: Prisma.NotificationWhereInput =
    {
      userId,
    };

  if (type) {
    where.type = type;
  }

  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        message: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [notifications, total] =
    await prisma.$transaction([
      prisma.notification.findMany({
        where,
        select: notificationSelect,
        orderBy: {
          createdAt: sortOrder,
        },
        skip,
        take: limit,
      }),

      prisma.notification.count({
        where,
      }),
    ]);

  return {
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit,
      ),
    },
  };
};

export const getMyUnreadCount = async (
  userId: string,
) => {
  const count =
    await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

  return {
    unreadCount: count,
  };
};

export const getMyNotificationById =
  async (
    userId: string,
    id: string,
  ) => {
    const notification =
      await prisma.notification.findFirst(
        {
          where: {
            id,
            userId,
          },
          select: notificationSelect,
        },
      );

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404,
      );
    }

    return notification;
  };

export const markNotificationAsRead =
  async (
    userId: string,
    id: string,
  ) => {
    const notification =
      await prisma.notification.findFirst(
        {
          where: {
            id,
            userId,
          },
          select: {
            id: true,
            isRead: true,
          },
        },
      );

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404,
      );
    }

    if (notification.isRead) {
      return prisma.notification.findUnique({
        where: {
          id: notification.id,
        },
        select: notificationSelect,
      });
    }

    return prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
      select: notificationSelect,
    });
  };

export const markAllNotificationsAsRead =
  async (
    userId: string,
  ) => {
    const result =
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

    return {
      updatedCount: result.count,
    };
  };

export const deleteMyNotification = async (
  userId: string,
  id: string,
) => {
  const notification =
    await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });

  if (!notification) {
    throw new AppError(
      "Notification not found",
      404,
    );
  }

  await prisma.notification.delete({
    where: {
      id: notification.id,
    },
  });

  return {
    id: notification.id,
  };
};

