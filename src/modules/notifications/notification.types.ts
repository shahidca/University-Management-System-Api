import type {
  NotificationType,
  Prisma,
} from "@prisma/client";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
}

export interface NotificationListQuery {
  page: number;
  limit: number;
  type?: NotificationType;
  isRead?: boolean;
  search?: string;
  sortOrder: "asc" | "desc";
}