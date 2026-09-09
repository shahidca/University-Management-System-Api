import type { RequestHandler } from "express";
import {
  InvoiceStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import {
  validateSSLCommerzPayment,
} from "./sslcommerz.service.js";

import type {
  SSLCommerzIpnPayload,
} from "./payment.types.js";

const toNumber = (
  value: unknown,
): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return NaN;
  }

  return number;
};

export const sslCommerzIpnController: RequestHandler =
  async (req, res, next) => {
    try {
      const payload =
        req.body as SSLCommerzIpnPayload;

      const transactionId =
        payload.tran_id;

      const validationId =
        payload.val_id;

      if (
        !transactionId ||
        !validationId
      ) {
        throw new AppError(
          "Invalid SSLCommerz notification",
          400,
        );
      }

      const payment =
        await prisma.payment.findUnique({
          where: {
            transactionId,
          },
          include: {
            invoice: true,
          },
        });

      if (!payment) {
        throw new AppError(
          "Payment transaction not found",
          404,
        );
      }

      /*
       * Idempotency:
       * If the webhook is received again after
       * successful processing, don't process it twice.
       */
      if (
        payment.status ===
        PaymentStatus.SUCCESS
      ) {
        res.status(200).json({
          success: true,
          message:
            "Payment already processed",
          data: {
            transactionId,
            status:
              payment.status,
          },
        });

        return;
      }

      const validation =
        await validateSSLCommerzPayment(
          validationId,
        );

      const validatedAmount =
        toNumber(validation.amount);

      const expectedAmount =
        Number(payment.amount);

      const currencyMatches =
        validation.currency ===
        payment.currency;

      const amountMatches =
        Number.isFinite(validatedAmount) &&
        Math.abs(
          validatedAmount -
            expectedAmount,
        ) < 0.01;

      const transactionMatches =
        validation.tran_id ===
        payment.transactionId;

      if (
        validation.status !== "VALID" &&
        validation.status !==
          "VALIDATED"
      ) {
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status:
              PaymentStatus.FAILED,
            failedAt: new Date(),
            failureReason:
              `SSLCommerz validation status: ${validation.status}`,
            gatewayTransactionId:
              validation.bank_tran_id ??
              payment.gatewayTransactionId,
            metadata: {
              ...(typeof payment.metadata ===
              "object" &&
              payment.metadata !== null
                ? (payment.metadata as Record<string, unknown>)
                : {}),
              validation: validation as unknown as Prisma.InputJsonValue,
            },
          },
        });

        res.status(200).json({
          success: true,
          message:
            "Payment validation completed",
          data: {
            transactionId,
            status:
              PaymentStatus.FAILED,
          },
        });

        return;
      }

      if (
        !amountMatches ||
        !currencyMatches ||
        !transactionMatches
      ) {
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status:
              PaymentStatus.FAILED,
            failedAt: new Date(),
            failureReason:
              "Payment verification failed: amount, currency, or transaction mismatch",
            metadata: {
              ...(typeof payment.metadata ===
              "object" &&
              payment.metadata !== null
                ? (payment.metadata as Record<string, unknown>)
                : {}),
              validation: validation as unknown as Prisma.InputJsonValue,
            },
          },
        });

        throw new AppError(
          "Payment verification failed",
          400,
        );
      }

      const result =
        await prisma.$transaction(
          async (tx) => {
            const currentPayment =
              await tx.payment.findUnique({
                where: {
                  id: payment.id,
                },
              });

            if (!currentPayment) {
              throw new AppError(
                "Payment not found",
                404,
              );
            }

            if (
              currentPayment.status ===
              PaymentStatus.SUCCESS
            ) {
              return currentPayment;
            }

            const updatedPayment =
              await tx.payment.update({
                where: {
                  id: currentPayment.id,
                },
                data: {
                  status:
                    PaymentStatus.SUCCESS,
                  gatewayTransactionId:
                    validation.bank_tran_id ??
                    currentPayment.gatewayTransactionId,
                  completedAt:
                    new Date(),
                  failureReason: null,
                  metadata: {
                    ...(typeof currentPayment.metadata ===
                    "object" &&
                    currentPayment.metadata !==
                      null
                      ? (currentPayment.metadata as Record<string, unknown>)
                      : {}),
                    validation: validation as unknown as Prisma.InputJsonValue,
                  },
                },
              });

            const successfulPayments =
              await tx.payment.aggregate({
                where: {
                  invoiceId:
                    currentPayment.invoiceId,
                  status:
                    PaymentStatus.SUCCESS,
                },
                _sum: {
                  amount: true,
                },
              });

            const paidAmount =
              Number(
                successfulPayments._sum
                  .amount ?? 0,
              );

            const invoice =
              await tx.invoice.findUnique({
                where: {
                  id:
                    currentPayment.invoiceId,
                },
              });

            if (!invoice) {
              throw new AppError(
                "Invoice not found",
                404,
              );
            }

            const invoiceTotal =
              Number(invoice.totalAmount);

            let invoiceStatus: InvoiceStatus;

            if (
              paidAmount >=
              invoiceTotal
            ) {
              invoiceStatus =
                InvoiceStatus.PAID;
            } else if (
              paidAmount > 0
            ) {
              invoiceStatus =
                InvoiceStatus.PARTIALLY_PAID;
            } else {
              invoiceStatus =
                InvoiceStatus.UNPAID;
            }

            await tx.invoice.update({
              where: {
                id: invoice.id,
              },
              data: {
                status:
                  invoiceStatus,
                paidAt:
                  invoiceStatus ===
                  InvoiceStatus.PAID
                    ? new Date()
                    : null,
              },
            });

            return updatedPayment;
          },
        );

      res.status(200).json({
        success: true,
        message:
          "Payment verified and processed successfully",
        data: {
          paymentId: result.id,
          transactionId:
            result.transactionId,
          status:
            result.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };