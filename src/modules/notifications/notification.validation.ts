import { z } from "zod";

import { NotificationType } from "@prisma/client";

export const notificationIdParamsSchema =
  z.object({
    id: z.uuid(),
  });

export const notificationListQuerySchema =
  z.object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    type: z
      .enum(NotificationType)
      .optional(),

    isRead: z
      .enum(["true", "false"])
      .transform(
        (value) => value === "true",
      )
      .optional(),

    search: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export const createNotificationSchema =
  z.object({
    userId: z.uuid(),

    type: z.enum(NotificationType),

    title: z
      .string()
      .trim()
      .min(1)
      .max(200),

    message: z
      .string()
      .trim()
      .min(1)
      .max(2000),

    metadata: z
      .record(
        z.string(),
        z.unknown(),
      )
      .optional(),
  });