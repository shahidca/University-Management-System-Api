import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateFeeInput,
  FeeListQuery,
  UpdateFeeInput,
} from "./fee.validation.js";

const feeSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  amount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.FeeSelect;

const normalizeCode = (code: string): string => {
  return code.trim().toUpperCase();
};

export const createFee = async (
  input: CreateFeeInput,
) => {
  const code = normalizeCode(input.code);

  const existingFee =
    await prisma.fee.findUnique({
      where: {
        code,
      },
      select: {
        id: true,
      },
    });

  if (existingFee) {
    throw new AppError(
      "A fee with this code already exists",
      409,
    );
  }

  try {
    const fee = await prisma.fee.create({
      data: {
        name: input.name.trim(),
        code,
        description:
          input.description?.trim() || null,
        amount: new Prisma.Decimal(
          input.amount,
        ),
        isActive:
          input.isActive ?? true,
      },
      select: feeSelect,
    });

    return fee;
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "A fee with this code already exists",
        409,
      );
    }

    throw error;
  }
};

export const getFees = async (
  query: FeeListQuery,
) => {
  const {
    page,
    limit,
    search,
    isActive,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.FeeWhereInput = {};

  if (search) {
    where.OR = [
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
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.FeeOrderByWithRelationInput;

  const [fees, total] =
    await prisma.$transaction([
      prisma.fee.findMany({
        where,
        select: feeSelect,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.fee.count({
        where,
      }),
    ]);

  const totalPages =
    Math.ceil(total / limit);

  return {
    fees,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage:
        page < totalPages,
      hasPreviousPage:
        page > 1,
    },
  };
};

export const getFeeById = async (
  id: string,
) => {
  const fee = await prisma.fee.findUnique({
    where: {
      id,
    },
    select: feeSelect,
  });

  if (!fee) {
    throw new AppError(
      "Fee not found",
      404,
    );
  }

  return fee;
};

export const updateFee = async (
  id: string,
  input: UpdateFeeInput,
) => {
  const existingFee =
    await prisma.fee.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
      },
    });

  if (!existingFee) {
    throw new AppError(
      "Fee not found",
      404,
    );
  }

  const data: Prisma.FeeUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name.trim();
  }

  if (input.code !== undefined) {
    const normalizedCode =
      normalizeCode(input.code);

    if (
      normalizedCode !==
      existingFee.code
    ) {
      const duplicate =
        await prisma.fee.findUnique({
          where: {
            code: normalizedCode,
          },
          select: {
            id: true,
          },
        });

      if (
        duplicate &&
        duplicate.id !== id
      ) {
        throw new AppError(
          "A fee with this code already exists",
          409,
        );
      }
    }

    data.code = normalizedCode;
  }

  if (input.description !== undefined) {
    data.description =
      input.description.trim() || null;
  }

  if (input.amount !== undefined) {
    data.amount =
      new Prisma.Decimal(
        input.amount,
      );
  }

  if (input.isActive !== undefined) {
    data.isActive =
      input.isActive;
  }

  try {
    const updatedFee =
      await prisma.fee.update({
        where: {
          id,
        },
        data,
        select: feeSelect,
      });

    return updatedFee;
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2002") {
        throw new AppError(
          "A fee with this code already exists",
          409,
        );
      }

      if (error.code === "P2025") {
        throw new AppError(
          "Fee not found",
          404,
        );
      }
    }

    throw error;
  }
};

export const deleteFee = async (
  id: string,
) => {
  const fee = await prisma.fee.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      code: true,
      _count: {
        select: {
          invoiceItems: true,
        },
      },
    },
  });

  if (!fee) {
    throw new AppError(
      "Fee not found",
      404,
    );
  }

  if (fee._count.invoiceItems > 0) {
    throw new AppError(
      "This fee cannot be deleted because it is already used by invoice items",
      409,
      [
        {
          invoiceItems:
            fee._count.invoiceItems,
        },
      ],
    );
  }

  try {
    await prisma.fee.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(
        "Fee not found",
        404,
      );
    }

    throw error;
  }
};