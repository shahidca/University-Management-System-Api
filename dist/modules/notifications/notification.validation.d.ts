import { z } from "zod";
export declare const notificationIdParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export declare const notificationListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    type: z.ZodOptional<z.ZodEnum<{
        SYSTEM: 'SYSTEM';
        ACADEMIC: 'ACADEMIC';
        ENROLLMENT: 'ENROLLMENT';
        ATTENDANCE: 'ATTENDANCE';
        EXAM: 'EXAM';
        RESULT: 'RESULT';
        PAYMENT: 'PAYMENT';
        INVOICE: 'INVOICE';
        TRANSCRIPT: 'TRANSCRIPT';
        SECURITY: 'SECURITY';
    }>>;
    isRead: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    search: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const createNotificationSchema: z.ZodObject<{
    userId: z.ZodUUID;
    type: z.ZodEnum<{
        SYSTEM: 'SYSTEM';
        ACADEMIC: 'ACADEMIC';
        ENROLLMENT: 'ENROLLMENT';
        ATTENDANCE: 'ATTENDANCE';
        EXAM: 'EXAM';
        RESULT: 'RESULT';
        PAYMENT: 'PAYMENT';
        INVOICE: 'INVOICE';
        TRANSCRIPT: 'TRANSCRIPT';
        SECURITY: 'SECURITY';
    }>;
    title: z.ZodString;
    message: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
//# sourceMappingURL=notification.validation.d.ts.map