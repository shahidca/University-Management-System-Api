import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateProgramInput,
  ProgramListQueryInput,
  UpdateProgramInput,
} from "./program.validation.js";

export const createProgram = async (
  input: CreateProgramInput,
) => {
  const department =
    await prisma.department.findFirst({
      where: {
        id: input.departmentId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

  if (!department) {
    throw new AppError(
      "Department not found",
      404,
    );
  }

  const existingProgram =
    await prisma.program.findFirst({
      where: {
        departmentId: input.departmentId,
        name: input.name,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

  if (existingProgram) {
    throw new AppError(
      "A program with this name already exists in the department",
      409,
    );
  }

  const existingCode =
    await prisma.program.findUnique({
      where: {
        code: input.code,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

  if (existingCode) {
    throw new AppError(
      existingCode.deletedAt
        ? "Program code already exists on a deleted program"
        : "Program code already exists",
      409,
    );
  }

  const program =
    await prisma.program.create({
      data: {
        departmentId: input.departmentId,
        name: input.name,
        code: input.code,
        degree: input.degree,
        durationYears:
          input.durationYears,
        totalCredits:
          new Prisma.Decimal(
            input.totalCredits,
          ),
        description:
          input.description ?? null,
      },
      include: {
        department: true,
      },
    });

  return program;
};

export const getPrograms = async (
  query: ProgramListQueryInput,
) => {
  const {
    page,
    limit,
    search,
    departmentId,
    degree,
    isActive,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.ProgramWhereInput = {
    deletedAt: null,

    ...(departmentId && {
      departmentId,
    }),

    ...(degree && {
      degree: {
        contains: degree,
        mode: "insensitive",
      },
    }),

    ...(isActive !== undefined && {
      isActive,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          degree: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [programs, total] =
    await prisma.$transaction([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          department: true,
        },
      }),

      prisma.program.count({
        where,
      }),
    ]);

  return {
    items: programs,
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

export const getProgramById = async (
  id: string,
) => {
  const program =
    await prisma.program.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        department: true,
      },
    });

  if (!program) {
    throw new AppError(
      "Program not found",
      404,
    );
  }

  return program;
};

export const updateProgram = async (
  id: string,
  input: UpdateProgramInput,
) => {
  const existingProgram =
    await prisma.program.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

  if (!existingProgram) {
    throw new AppError(
      "Program not found",
      404,
    );
  }

  if (
    input.name !== undefined &&
    input.name !== existingProgram.name
  ) {
    const duplicateName =
      await prisma.program.findFirst({
        where: {
          departmentId:
            existingProgram.departmentId,
          name: input.name,
          id: {
            not: id,
          },
          deletedAt: null,
        },
      });

    if (duplicateName) {
      throw new AppError(
        "A program with this name already exists in the department",
        409,
      );
    }
  }

  if (
    input.code !== undefined &&
    input.code !== existingProgram.code
  ) {
    const duplicateCode =
      await prisma.program.findUnique({
        where: {
          code: input.code,
        },
      });

    if (duplicateCode) {
      throw new AppError(
        "Program code already exists",
        409,
      );
    }
  }

  const updatedProgram =
    await prisma.program.update({
      where: {
        id,
      },
      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),

        ...(input.code !== undefined && {
          code: input.code,
        }),

        ...(input.degree !== undefined && {
          degree: input.degree,
        }),

        ...(input.durationYears !==
          undefined && {
          durationYears:
            input.durationYears,
        }),

        ...(input.totalCredits !==
          undefined && {
          totalCredits:
            new Prisma.Decimal(
              input.totalCredits,
            ),
        }),

        ...(input.description !==
          undefined && {
          description:
            input.description,
        }),
      },
      include: {
        department: true,
      },
    });

  return updatedProgram;
};

export const deleteProgram = async (
  id: string,
) => {
  const program =
    await prisma.program.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

  if (!program) {
    throw new AppError(
      "Program not found",
      404,
    );
  }

  if (program._count.students > 0) {
    throw new AppError(
      "Cannot delete a program with enrolled students",
      409,
    );
  }

  await prisma.program.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};