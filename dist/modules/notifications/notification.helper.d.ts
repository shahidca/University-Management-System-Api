import type { NotificationType, Prisma } from "@prisma/client";
interface SendNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Prisma.InputJsonValue;
}
export declare const sendNotification: (input: SendNotificationInput) => Promise<void>;
export {};
//# sourceMappingURL=notification.helper.d.ts.map