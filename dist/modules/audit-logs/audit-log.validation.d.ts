import { z } from "zod";
export declare const auditLogIdParamsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
export type AuditLogListQueryInput = z.infer<typeof auditLogListQuerySchema>;
export type AuditLogIdParams = z.infer<typeof auditLogIdParamsSchema>;
export declare const auditLogListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    actorId: z.ZodOptional<z.ZodUUID>;
    action: z.ZodOptional<z.ZodString>;
    entity: z.ZodOptional<z.ZodString>;
    entityId: z.ZodOptional<z.ZodUUID>;
    search: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        action: "action";
        createdAt: "createdAt";
        entity: "entity";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=audit-log.validation.d.ts.map