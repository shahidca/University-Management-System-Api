import { z } from "zod";

export const auditLogIdParamsSchema = z.object({
  id: z.uuid(),
});

export type AuditLogListQueryInput = z.infer<typeof auditLogListQuerySchema>;
export type AuditLogIdParams = z.infer<typeof auditLogIdParamsSchema>;

export const auditLogListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  actorId: z.uuid().optional(),
  action: z.string().trim().min(1).max(100).optional(),
  entity: z.string().trim().min(1).max(100).optional(),
  entityId: z.uuid().optional(),

  search: z.string().trim().min(1).max(100).optional(),

  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),

  sortBy: z
    .enum([
      "createdAt",
      "action",
      "entity",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});