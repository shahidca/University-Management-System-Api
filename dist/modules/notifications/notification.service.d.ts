import { Prisma } from "@prisma/client";
import type { CreateNotificationInput, NotificationListQuery } from "./notification.types.js";
export declare const createNotification: (input: CreateNotificationInput) => Promise<{
    createdAt: Date;
    id: string;
    isRead: boolean;
    message: string;
    metadata: Prisma.JsonValue;
    readAt: Date | null;
    title: string;
    type: import("@prisma/client").$Enums.NotificationType;
    updatedAt: Date;
    userId: string;
}>;
export declare const getMyNotifications: (userId: string, query: NotificationListQuery) => Promise<{
    data: {
        createdAt: Date;
        id: string;
        isRead: boolean;
        message: string;
        metadata: Prisma.JsonValue;
        readAt: Date | null;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        updatedAt: Date;
        userId: string;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getMyUnreadCount: (userId: string) => Promise<{
    unreadCount: number;
}>;
export declare const getMyNotificationById: (userId: string, id: string) => Promise<{
    createdAt: Date;
    id: string;
    isRead: boolean;
    message: string;
    metadata: Prisma.JsonValue;
    readAt: Date | null;
    title: string;
    type: import("@prisma/client").$Enums.NotificationType;
    updatedAt: Date;
    userId: string;
}>;
export declare const markNotificationAsRead: (userId: string, id: string) => Promise<{
    createdAt: Date;
    id: string;
    isRead: boolean;
    message: string;
    metadata: Prisma.JsonValue;
    readAt: Date | null;
    title: string;
    type: import("@prisma/client").$Enums.NotificationType;
    updatedAt: Date;
    userId: string;
} | null>;
export declare const markAllNotificationsAsRead: (userId: string) => Promise<{
    updatedCount: number;
}>;
export declare const deleteMyNotification: (userId: string, id: string) => Promise<{
    id: string;
}>;
//# sourceMappingURL=notification.service.d.ts.map