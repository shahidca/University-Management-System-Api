import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateInvoiceInput,
  InvoiceListQuery,
  UpdateInvoiceInput,
} from "./invoice.validation.js";

const invoiceSelect = {
  id: true,
  studentId: true,
  invoiceNumber: true,
  subtotal: true,
  discount: true,
  totalAmount: true,
  dueDate: true,
  status: true,
  description: true,
  issuedAt: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,

  student: {
    select: {
      id: true,
      studentId: true,
      firstName: true,
      lastName: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  },

  items: {
    orderBy: {
      createdAt: "asc" as const,
    },

    select: {
      id: true,
      invoiceId: true,
      feeId: true,
      description: true,
      quantity: true,
      unitAmount: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,

      fee: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
} satisfies Prisma.InvoiceSelect;

const generateInvoiceNumber = (): string => {
  const now = new Date();

  const year = now.getUTCFullYear();

  const month = String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    now.getUTCDate(),
  ).padStart(2, "0");

  const randomPart =
    Math.floor(
      100000 +
        Math.random() * 900000,
    );

  return `INV-${year}${month}${day}-${randomPart}`;
};

// const calculateInvoiceTotals = (
//   items: Array<{
//     quantity: number;
//     amount: Prisma.Decimal;
//   }>,
//   discount: Prisma.Decimal,
// ) => {
//   const subtotal = items.reduce(
//     (sum, item) =>
//       sum +
//       item.amount
//         .mul(item.quantity),
//     new Prisma.Decimal(0),
//   );

//   if (
//     discount.greaterThan(subtotal)
//   ) {
//     throw new AppError(
//       "Discount cannot be greater than invoice subtotal",
//       400,
//     );
//   }

//   const totalAmount =
//     subtotal.sub(discount);

//   return {
//     subtotal,
//     discount,
//     totalAmount,
//   };
// };

export const createInvoice = async (
  input: CreateInvoiceInput,
) => {
  const discount = new Prisma.Decimal(
    input.discount ?? 0,
  );

  const result =
    await prisma.$transaction(
      async (tx) => {
        const student =
          await tx.studentProfile.findUnique(
            {
              where: {
                id: input.studentId,
              },
              select: {
                id: true,
                studentId: true,
                firstName: true,
                lastName: true,
              },
            },
          );

        if (!student) {
          throw new AppError(
            "Student not found",
            404,
          );
        }

        const feeIds =
          input.items.map(
            (item) => item.feeId,
          );

        const uniqueFeeIds =
          new Set(feeIds);

        if (
          uniqueFeeIds.size !==
          feeIds.length
        ) {
          throw new AppError(
            "The same fee cannot be added to an invoice more than once",
            400,
          );
        }

        const fees =
          await tx.fee.findMany({
            where: {
              id: {
                in: feeIds,
              },
            },

            select: {
              id: true,
              name: true,
              code: true,
              amount: true,
              isActive: true,
            },
          });

        if (
          fees.length !==
          feeIds.length
        ) {
          const foundFeeIds =
            new Set(
              fees.map(
                (fee) => fee.id,
              ),
            );

          const missingFee =
            feeIds.find(
              (feeId) =>
                !foundFeeIds.has(
                  feeId,
                ),
            );

          throw new AppError(
            `Fee not found: ${missingFee}`,
            404,
          );
        }

        const inactiveFee =
          fees.find(
            (fee) => !fee.isActive,
          );

        if (inactiveFee) {
          throw new AppError(
            `Fee "${inactiveFee.name}" is inactive and cannot be added to an invoice`,
            400,
          );
        }

        const feeMap = new Map(
          fees.map((fee) => [
            fee.id,
            fee,
          ]),
        );

        const calculatedItems =
          input.items.map(
            (item) => {
              const fee =
                feeMap.get(
                  item.feeId,
                );

              if (!fee) {
                throw new AppError(
                  "Fee not found",
                  404,
                );
              }

              const unitAmount =
                fee.amount;

              const totalAmount =
                unitAmount.mul(
                  item.quantity,
                );

              return {
                feeId: fee.id,
                description:
                  item.description?.trim() ||
                  fee.name,
                quantity:
                  item.quantity,
                unitAmount,
                totalAmount,
              };
            },
          );

        const subtotal =
          calculatedItems.reduce(
            (sum, item) =>
              sum.add(
                item.totalAmount,
              ),
            new Prisma.Decimal(0),
          );

        if (
          discount.greaterThan(
            subtotal,
          )
        ) {
          throw new AppError(
            "Discount cannot be greater than invoice subtotal",
            400,
          );
        }

        const totalAmount =
          subtotal.sub(
            discount,
          );

        let invoiceNumber =
          generateInvoiceNumber();

        let invoice;

        for (
          let attempt = 0;
          attempt < 5;
          attempt += 1
        ) {
          try {
            invoice =
              await tx.invoice.create(
                {
                  data: {
                    studentId:
                      student.id,

                    invoiceNumber,

                    subtotal,

                    discount,

                    totalAmount,

                    dueDate:
                      input.dueDate,

                    description:
                      input.description?.trim() ||
                      null,

                    items: {
                      create:
                        calculatedItems.map(
                          (item) => ({
                            feeId:
                              item.feeId,

                            description:
                              item.description,

                            quantity:
                              item.quantity,

                            unitAmount:
                              item.unitAmount,

                            totalAmount:
                              item.totalAmount,
                          }),
                        ),
                    },
                  },

                  select:
                    invoiceSelect,
                },
              );

            break;
          } catch (error) {
            if (
              error instanceof
                Prisma.PrismaClientKnownRequestError &&
              error.code === "P2002"
            ) {
              invoiceNumber =
                generateInvoiceNumber();

              continue;
            }

            throw error;
          }
        }

        if (!invoice) {
          throw new AppError(
            "Unable to generate a unique invoice number",
            500,
          );
        }

        return invoice;
      },
    );

  return result;
};

export const getInvoices = async (
  query: InvoiceListQuery,
) => {
  const {
    page,
    limit,
    studentId,
    status,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip =
    (page - 1) * limit;

  const where: Prisma.InvoiceWhereInput =
    {};

  if (studentId) {
    where.studentId = studentId;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      {
        invoiceNumber: {
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
      {
        student: {
          OR: [
            {
              studentId: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.InvoiceOrderByWithRelationInput;

  const [invoices, total] =
    await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        select: invoiceSelect,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.invoice.count({
        where,
      }),
    ]);

  const totalPages =
    Math.ceil(total / limit);

  return {
    invoices,
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

export const getInvoiceById = async (
  id: string,
) => {
  const invoice =
    await prisma.invoice.findUnique({
      where: {
        id,
      },
      select: invoiceSelect,
    });

  if (!invoice) {
    throw new AppError(
      "Invoice not found",
      404,
    );
  }

  return invoice;
};

export const updateInvoice = async (
  id: string,
  input: UpdateInvoiceInput,
) => {
  const existingInvoice =
    await prisma.invoice.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        subtotal: true,
        discount: true,
        totalAmount: true,
      },
    });

  if (!existingInvoice) {
    throw new AppError(
      "Invoice not found",
      404,
    );
  }

  if (
    existingInvoice.status ===
      "PAID" ||
    existingInvoice.status ===
      "CANCELLED"
  ) {
    throw new AppError(
      `A ${existingInvoice.status.toLowerCase()} invoice cannot be modified`,
      409,
    );
  }

  const data: Prisma.InvoiceUpdateInput =
    {};

  if (input.dueDate !== undefined) {
    data.dueDate =
      input.dueDate;
  }

  if (
    input.description !==
    undefined
  ) {
    data.description =
      input.description.trim() ||
      null;
  }

  if (input.discount !== undefined) {
    const newDiscount =
      new Prisma.Decimal(
        input.discount,
      );

    if (
      newDiscount.greaterThan(
        existingInvoice.subtotal,
      )
    ) {
      throw new AppError(
        "Discount cannot be greater than invoice subtotal",
        400,
      );
    }

    data.discount =
      newDiscount;

    data.totalAmount =
      existingInvoice.subtotal.sub(
        newDiscount,
      );
  }

  try {
    return await prisma.invoice.update(
      {
        where: {
          id,
        },
        data,
        select: invoiceSelect,
      },
    );
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(
        "Invoice not found",
        404,
      );
    }

    throw error;
  }
};

export const cancelInvoice = async (
  id: string,
) => {
  const invoice =
    await prisma.invoice.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
          },
        },
      },
    });

  if (!invoice) {
    throw new AppError(
      "Invoice not found",
      404,
    );
  }

  if (
    invoice.status === "PAID"
  ) {
    throw new AppError(
      "A paid invoice cannot be cancelled",
      409,
    );
  }

  if (
    invoice.status === "CANCELLED"
  ) {
    throw new AppError(
      "Invoice is already cancelled",
      409,
    );
  }

  const successfulPayment =
    invoice.payments.find(
      (payment) =>
        payment.status ===
        "SUCCESS",
    );

  if (successfulPayment) {
    throw new AppError(
      "An invoice with successful payments cannot be cancelled",
      409,
    );
  }

  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      status: "CANCELLED",
    },

    select: invoiceSelect,
  });
};