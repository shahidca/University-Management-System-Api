import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  AuditLogListQueryInput,
} from "./audit-log.validation.js";

const auditLogSelect = {
  id: true,
  actorId: true,
  action: true,
  entity: true,
  entityId: true,
  oldValue: true,
  newValue: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.AuditLogSelect;

export const getAuditLogs = async (
  query: AuditLogListQueryInput,
) => {
  const {
    page,
    limit,
    actorId,
    action,
    entity,
    entityId,
    search,
    from,
    to,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.AuditLogWhereInput = {};

  if (actorId) {
    where.actorId = actorId;
  }

  if (action) {
    where.action = {
      contains: action,
      mode: "insensitive",
    };
  }

  if (entity) {
    where.entity = {
      contains: entity,
      mode: "insensitive",
    };
  }

  if (entityId) {
    where.entityId = entityId;
  }

  if (search) {
    where.OR = [
      {
        action: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        entity: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        entityId: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        actor: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    };
  }

  const skip = (page - 1) * limit;

  const [logs, total] =
    await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        select: auditLogSelect,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),

      prisma.auditLog.count({
        where,
      }),
    ]);

  return {
    data: logs,
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

export const getAuditLogById = async (
  id: string,
) => {
  const auditLog =
    await prisma.auditLog.findUnique({
      where: {
        id,
      },
      select: auditLogSelect,
    });

  if (!auditLog) {
    throw new AppError(
      "Audit log not found",
      404,
    );
  }

  return auditLog;
};