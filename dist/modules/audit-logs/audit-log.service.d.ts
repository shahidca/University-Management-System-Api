import { Prisma } from "@prisma/client";
import type { AuditLogListQueryInput } from "./audit-log.validation.js";
export declare const getAuditLogs: (query: AuditLogListQueryInput) => Promise<{
    data: {
        action: string;
        actor: {
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
        };
        actorId: string;
        createdAt: Date;
        entity: string;
        entityId: string | null;
        id: string;
        ipAddress: string | null;
        newValue: Prisma.JsonValue;
        oldValue: Prisma.JsonValue;
        userAgent: string | null;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getAuditLogById: (id: string) => Promise<{
    action: string;
    actor: {
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
    };
    actorId: string;
    createdAt: Date;
    entity: string;
    entityId: string | null;
    id: string;
    ipAddress: string | null;
    newValue: Prisma.JsonValue;
    oldValue: Prisma.JsonValue;
    userAgent: string | null;
}>;
//# sourceMappingURL=audit-log.service.d.ts.map