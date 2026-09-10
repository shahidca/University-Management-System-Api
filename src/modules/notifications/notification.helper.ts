import type {
  NotificationType,
  Prisma,
} from "@prisma/client";

import {
  createNotification,
} from "./notification.service.js";

interface SendNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
}

export const sendNotification = async (
  input: SendNotificationInput,
): Promise<void> => {
  try {
    await createNotification(input);
  } catch (error) {
    console.error(
      "Failed to create notification:",
      error,
    );
  }
};