import {
  Prisma,
  PaymentStatus,
  InvoiceStatus,
  PaymentGateway,
} from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  InitiatePaymentInput,
  PaymentListQuery,
} from "./payment.validation.js";

import {
  initiateSSLCommerzPayment,
} from "./sslcommerz.service.js";

export interface PaymentInitiationResult {
  paymentId: string;
  transactionId: string;
  invoiceId: string;
  gateway: PaymentGateway;
  amount: string;
  currency: string;
  status: PaymentStatus;
  paymentUrl: string | null;
}

const paymentSelect = {
  id: true,
  invoiceId: true,
  transactionId: true,
  gateway: true,
  gatewayTransactionId: true,
  amount: true,
  currency: true,
  status: true,
  paymentUrl: true,
  initiatedAt: true,
  completedAt: true,
  failedAt: true,
  failureReason: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,

  invoice: {
    select: {
      id: true,
      invoiceNumber: true,
      subtotal: true,
      discount: true,
      totalAmount: true,
      dueDate: true,
      status: true,
      student: {
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.PaymentSelect;

const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  return `TXN-${timestamp}-${randomPart}`;
};

const generateUniqueTransactionId = async (
  tx: Prisma.TransactionClient,
): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const transactionId = generateTransactionId();
    const existing = await tx.payment.findUnique({
      where: { transactionId },
      select: { id: true },
    });
    if (!existing) {
      return transactionId;
    }
  }
  throw new AppError(
    "Unable to generate a unique transaction ID",
    500,
  );
};

export const initiatePayment = async (
  input: InitiatePaymentInput,
  actorId: string = "SYSTEM",
): Promise<PaymentInitiationResult> => {
  const payment = await prisma.$transaction(
    async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: {
          id: input.invoiceId,
        },
        include: {
          payments: {
            where: {
              status: PaymentStatus.SUCCESS,
            },
            select: {
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

      if (invoice.status === InvoiceStatus.CANCELLED) {
        throw new AppError(
          "Cannot initiate payment for a cancelled invoice",
          400,
        );
      }

      if (invoice.status === InvoiceStatus.PAID) {
        throw new AppError(
          "Invoice is already fully paid",
          400,
        );
      }

      const existingPayment =
        await tx.payment.findFirst({
          where: {
            invoiceId: invoice.id,
            status: {
              in: [
                PaymentStatus.PENDING,
                PaymentStatus.PROCESSING,
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (existingPayment) {
        return existingPayment;
      }

      const successfulAmount =
        invoice.payments.reduce(
          (sum, p) => sum + Number(p.amount),
          0,
        );

      const outstandingAmount =
        Number(invoice.totalAmount) -
        successfulAmount;

      if (outstandingAmount <= 0) {
        throw new AppError(
          "Invoice has no outstanding balance",
          400,
        );
      }

      const transactionId =
        await generateUniqueTransactionId(tx);

      return tx.payment.create({
        data: {
          invoiceId: invoice.id,
          transactionId,
          gateway: input.gateway,
          amount: outstandingAmount,
          currency: "BDT",
          status: PaymentStatus.PENDING,
          metadata: {
            invoiceNumber: invoice.invoiceNumber,
            initiatedBy: actorId,
          },
        },
      });
    },
  );

  if (payment.gateway !== PaymentGateway.SSLCOMMERZ) {
    throw new AppError(
      "Only SSLCommerz is currently implemented",
      400,
    );
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: payment.invoiceId,
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
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

  const customerName =
    `${invoice.student.firstName} ${invoice.student.lastName}`.trim();

  const customerEmail =
    invoice.student.user.email;

  const customerPhone =
    invoice.student.phone ?? "01700000000";

  const customerAddress =
    invoice.student.address ?? "Bangladesh";

  try {
    const gateway =
      await initiateSSLCommerzPayment({
        transactionId: payment.transactionId,
        amount: payment.amount.toString(),
        currency: payment.currency,
        invoiceNumber: invoice.invoiceNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
      });

    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.PROCESSING,
          paymentUrl:
            gateway.GatewayPageURL ?? null,
          gatewayTransactionId:
            gateway.tran_id ?? null,
          metadata: {
            ...(typeof payment.metadata ===
              "object" &&
            payment.metadata !== null
              ? (payment.metadata as Record<string, unknown>)
              : {}),
            sslcommerz: {
              sessionkey:
                gateway.sessionkey ?? null,
              status: gateway.status,
            },
          } as Prisma.InputJsonValue,
        },
      });

    return {
      paymentId: updatedPayment.id,
      transactionId:
        updatedPayment.transactionId,
      invoiceId: updatedPayment.invoiceId,
      gateway: updatedPayment.gateway,
      amount: updatedPayment.amount.toString(),
      currency: updatedPayment.currency,
      status: updatedPayment.status,
      paymentUrl: updatedPayment.paymentUrl,
    };
  } catch (error) {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureReason:
          error instanceof Error
            ? error.message
            : "Payment gateway initialization failed",
      },
    });

    throw error;
  }
};

export const getPayments = async (
  query: PaymentListQuery,
) => {
  const {
    page,
    limit,
    invoiceId,
    status,
    gateway,
    transactionId,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};

  if (invoiceId) {
    where.invoiceId = invoiceId;
  }

  if (status) {
    where.status = status;
  }

  if (gateway) {
    where.gateway = gateway;
  }

  if (transactionId) {
    where.transactionId = {
      contains: transactionId,
      mode: "insensitive",
    };
  }

  if (search) {
    where.OR = [
      {
        transactionId: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        gatewayTransactionId: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        invoice: {
          invoiceNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.PaymentOrderByWithRelationInput;

  const [payments, total] =
    await prisma.$transaction([
      prisma.payment.findMany({
        where,
        select: paymentSelect,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.payment.count({
        where,
      }),
    ]);

  const totalPages = Math.ceil(total / limit);

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getPaymentById = async (
  id: string,
) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id,
      },
      select: paymentSelect,
    });

  if (!payment) {
    throw new AppError(
      "Payment not found",
      404,
    );
  }

  return payment;
};

export const getPaymentByTransactionId =
  async (transactionId: string) => {
    const payment =
      await prisma.payment.findUnique({
        where: {
          transactionId,
        },
        select: paymentSelect,
      });

    if (!payment) {
      throw new AppError(
        "Payment not found",
        404,
      );
    }

    return payment;
  };