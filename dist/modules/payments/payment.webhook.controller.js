import { InvoiceStatus, PaymentStatus, Prisma, } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { validateSSLCommerzPayment, } from "./sslcommerz.service.js";
const toNumber = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return NaN;
    }
    return number;
};
const isValidCurrency = (value) => {
    return (typeof value === "string" &&
        value.trim().length > 0);
};
const mergeMetadata = (existing, extra) => {
    const base = typeof existing === "object" &&
        existing !== null &&
        !Array.isArray(existing)
        ? existing
        : {};
    return {
        ...base,
        ...extra,
    };
};
/**
 * SSLCommerz IPN
 *
 * This is the authoritative payment notification endpoint.
 *
 * IMPORTANT:
 * We never trust the IPN status alone.
 * The transaction is validated against SSLCommerz's
 * validation API before local payment state is changed.
 */
export const sslCommerzIpnController = async (req, res, next) => {
    try {
        const payload = req.body;
        const transactionId = payload.tran_id;
        const validationId = payload.val_id;
        if (!transactionId ||
            !validationId) {
            throw new AppError("Invalid SSLCommerz notification", 400);
        }
        const payment = await prisma.payment.findUnique({
            where: {
                transactionId,
            },
            include: {
                invoice: true,
            },
        });
        if (!payment) {
            throw new AppError("Payment transaction not found", 404);
        }
        /*
         * Idempotency.
         *
         * SSLCommerz may send the same notification
         * more than once.
         */
        if (payment.status ===
            PaymentStatus.SUCCESS) {
            res.status(200).json({
                success: true,
                message: "Payment already processed",
                data: {
                    transactionId,
                    status: PaymentStatus.SUCCESS,
                },
            });
            return;
        }
        /*
         * Validate the transaction directly
         * with SSLCommerz.
         */
        const validation = await validateSSLCommerzPayment(validationId);
        const validatedAmount = toNumber(validation.amount);
        const expectedAmount = toNumber(payment.amount);
        const amountMatches = Number.isFinite(validatedAmount) &&
            Number.isFinite(expectedAmount) &&
            Math.abs(validatedAmount -
                expectedAmount) < 0.01;
        const currencyMatches = isValidCurrency(validation.currency) &&
            validation.currency.toUpperCase() ===
                payment.currency.toUpperCase();
        const transactionMatches = validation.tran_id ===
            payment.transactionId;
        const validationMetadata = {
            validationStatus: validation.status,
            validationId,
            validatedAt: new Date().toISOString(),
            validatedAmount: validation.amount,
            validatedCurrency: validation.currency,
            bankTransactionId: validation.bank_tran_id,
            riskLevel: validation.risk_level,
            riskTitle: validation.risk_title,
        };
        /*
         * SSLCommerz validation status must be valid.
         */
        const validStatus = validation.status ===
            "VALID" ||
            validation.status ===
                "VALIDATED";
        if (!validStatus) {
            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: PaymentStatus.FAILED,
                    failedAt: new Date(),
                    failureReason: `SSLCommerz validation status: ${validation.status}`,
                    gatewayTransactionId: validation.bank_tran_id ??
                        payment.gatewayTransactionId,
                    metadata: mergeMetadata(payment.metadata, {
                        sslcommerz: validationMetadata,
                    }),
                },
            });
            res.status(200).json({
                success: true,
                message: "Payment validation failed",
                data: {
                    transactionId,
                    status: PaymentStatus.FAILED,
                },
            });
            return;
        }
        /*
         * Never accept a transaction when
         * amount/currency/transaction ID differs.
         */
        if (!amountMatches ||
            !currencyMatches ||
            !transactionMatches) {
            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: PaymentStatus.FAILED,
                    failedAt: new Date(),
                    failureReason: "Payment verification failed: amount, currency, or transaction mismatch",
                    gatewayTransactionId: validation.bank_tran_id ??
                        payment.gatewayTransactionId,
                    metadata: mergeMetadata(payment.metadata, {
                        sslcommerz: validationMetadata,
                        verificationFailure: {
                            amountMatches,
                            currencyMatches,
                            transactionMatches,
                        },
                    }),
                },
            });
            res.status(200).json({
                success: true,
                message: "Payment verification failed",
                data: {
                    transactionId,
                    status: PaymentStatus.FAILED,
                },
            });
            return;
        }
        /*
         * Risk handling.
         *
         * SSLCommerz may mark a transaction as risky.
         * We do NOT automatically consider it successful.
         *
         * Payment remains PROCESSING so an admin can
         * review/reconcile it later.
         */
        if (validation.risk_level === "1") {
            const processingPayment = await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: PaymentStatus.PROCESSING,
                    gatewayTransactionId: validation.bank_tran_id ??
                        payment.gatewayTransactionId,
                    failureReason: null,
                    metadata: mergeMetadata(payment.metadata, {
                        sslcommerz: validationMetadata,
                        riskReviewRequired: true,
                    }),
                },
            });
            res.status(200).json({
                success: true,
                message: "Payment received and requires risk review",
                data: {
                    paymentId: processingPayment.id,
                    transactionId: processingPayment.transactionId,
                    status: processingPayment.status,
                },
            });
            return;
        }
        /*
         * Final successful processing.
         *
         * Payment update and invoice recalculation
         * happen inside one transaction.
         */
        const result = await prisma.$transaction(async (tx) => {
            const currentPayment = await tx.payment.findUnique({
                where: {
                    id: payment.id,
                },
            });
            if (!currentPayment) {
                throw new AppError("Payment not found", 404);
            }
            /*
             * Another IPN request may have completed
             * the payment while this request was running.
             */
            if (currentPayment.status ===
                PaymentStatus.SUCCESS) {
                return currentPayment;
            }
            /*
             * Do not allow a cancelled/failed payment
             * to be silently resurrected by an old callback.
             */
            if (currentPayment.status ===
                PaymentStatus.CANCELLED ||
                currentPayment.status ===
                    PaymentStatus.FAILED) {
                throw new AppError("Payment is no longer eligible for successful processing", 409);
            }
            const updatedPayment = await tx.payment.update({
                where: {
                    id: currentPayment.id,
                },
                data: {
                    status: PaymentStatus.SUCCESS,
                    gatewayTransactionId: validation.bank_tran_id ??
                        currentPayment.gatewayTransactionId,
                    completedAt: new Date(),
                    failedAt: null,
                    failureReason: null,
                    metadata: mergeMetadata(currentPayment.metadata, {
                        sslcommerz: validationMetadata,
                    }),
                },
            });
            /*
             * Recalculate the invoice from successful
             * payments rather than trusting callback data.
             */
            const successfulPayments = await tx.payment.aggregate({
                where: {
                    invoiceId: currentPayment.invoiceId,
                    status: PaymentStatus.SUCCESS,
                },
                _sum: {
                    amount: true,
                },
            });
            const paidAmount = toNumber(successfulPayments
                ._sum.amount ?? 0);
            const invoice = await tx.invoice.findUnique({
                where: {
                    id: currentPayment.invoiceId,
                },
            });
            if (!invoice) {
                throw new AppError("Invoice not found", 404);
            }
            /*
             * A cancelled invoice must never become
             * PAID through an old payment callback.
             */
            if (invoice.status ===
                InvoiceStatus.CANCELLED) {
                throw new AppError("Cancelled invoice cannot receive payment", 409);
            }
            const invoiceTotal = toNumber(invoice.totalAmount);
            let invoiceStatus;
            if (paidAmount >=
                invoiceTotal) {
                invoiceStatus =
                    InvoiceStatus.PAID;
            }
            else if (paidAmount > 0) {
                invoiceStatus =
                    InvoiceStatus.PARTIALLY_PAID;
            }
            else {
                invoiceStatus =
                    InvoiceStatus.UNPAID;
            }
            await tx.invoice.update({
                where: {
                    id: invoice.id,
                },
                data: {
                    status: invoiceStatus,
                    paidAt: invoiceStatus ===
                        InvoiceStatus.PAID
                        ? new Date()
                        : null,
                },
            });
            return updatedPayment;
        });
        res.status(200).json({
            success: true,
            message: "Payment verified and processed successfully",
            data: {
                paymentId: result.id,
                transactionId: result.transactionId,
                status: result.status,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * SSLCommerz success callback.
 *
 * IMPORTANT:
 * This endpoint does NOT mark the payment successful.
 * The IPN/validation flow is responsible for that.
 */
export const sslCommerzSuccessController = async (req, res, next) => {
    try {
        const payload = req.body;
        res.status(200).json({
            success: true,
            message: "Payment success callback received",
            data: {
                transactionId: payload.tran_id ?? null,
                validationId: payload.val_id ?? null,
                status: "AWAITING_SERVER_VERIFICATION",
            },
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * SSLCommerz failure callback.
 *
 * IMPORTANT:
 * This endpoint does NOT directly change
 * the local payment status.
 */
export const sslCommerzFailController = async (req, res, next) => {
    try {
        const payload = req.body;
        res.status(200).json({
            success: true,
            message: "Payment failure callback received",
            data: {
                transactionId: payload.tran_id ?? null,
                validationId: payload.val_id ?? null,
                status: "CALLBACK_RECEIVED",
            },
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * SSLCommerz cancellation callback.
 *
 * IMPORTANT:
 * This endpoint does NOT directly change
 * the local payment status.
 */
export const sslCommerzCancelController = async (req, res, next) => {
    try {
        const payload = req.body;
        res.status(200).json({
            success: true,
            message: "Payment cancellation callback received",
            data: {
                transactionId: payload.tran_id ?? null,
                validationId: payload.val_id ?? null,
                status: "CALLBACK_RECEIVED",
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=payment.webhook.controller.js.map