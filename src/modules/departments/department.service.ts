import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateDepartmentInput,
  DepartmentListQuery,
  UpdateDepartmentInput,
} from "./department.validation.js";

export const createDepartment = async (
  input: CreateDepartmentInput,
) => {
  const code = input.code.toUpperCase();

  const existingDepartment =
    await prisma.department.findFirst({
      where: {
        OR: [
          {
            code,
          },
          {
            name: input.name,
          },
        ],
      },
    });

  if (existingDepartment) {
    throw new AppError(
      "Department with this name or code already exists",
      409,
    );
  }

  return prisma.department.create({
    data: {
      name: input.name,
      code,
      description: input.description ?? null,
    },
  });
};

export const getDepartments = async (
  query: DepartmentListQuery,
) => {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [departments, total] =
    await prisma.$transaction([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.department.count({
        where,
      }),
    ]);

  return {
    departments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepartmentById = async (
  id: string,
) => {
  const department =
    await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        programs: true,
      },
    });

  if (!department) {
    throw new AppError(
      "Department not found",
      404,
    );
  }

  return department;
};

export const updateDepartment = async (
  id: string,
  input: UpdateDepartmentInput,
) => {
  const department =
    await prisma.department.findUnique({
      where: {
        id,
      },
    });

  if (!department) {
    throw new AppError(
      "Department not found",
      404,
    );
  }

  const code = input.code?.toUpperCase();

  if (input.name || code) {
    const duplicate =
      await prisma.department.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [
            ...(input.name
              ? [{ name: input.name }]
              : []),
            ...(code
              ? [{ code }]
              : []),
          ],
        },
      });

    if (duplicate) {
      throw new AppError(
        "Department with this name or code already exists",
        409,
      );
    }
  }

  return prisma.department.update({
    where: {
      id,
    },
    data: {
      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(code !== undefined && {
        code,
      }),

      ...(input.description !== undefined && {
        description: input.description,
      }),
    },
  });
};

export const deleteDepartment = async (
  id: string,
) => {
  const department =
    await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            programs: true,
          },
        },
      },
    });

  if (!department) {
    throw new AppError(
      "Department not found",
      404,
    );
  }

  if (department._count.programs > 0) {
    throw new AppError(
      "Cannot delete a department that has programs",
      409,
    );
  }

  await prisma.department.delete({
    where: {
      id,
    },
  });
};