import { InvoiceStatus, PaymentGateway, PaymentStatus, Prisma, } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { paymentSuccessfulNotification, } from "../notifications/notification.templates.js";
import { sendNotification, } from "../notifications/notification.helper.js";
import { querySSLCommerzTransaction, } from "./sslcommerz.service.js";
const toNumber = (value) => {
    return Number(value);
};
const recalculateInvoiceStatus = async (tx, invoiceId) => {
    const invoice = await tx.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select: {
            id: true,
            totalAmount: true,
            status: true,
        },
    });
    if (!invoice) {
        throw new AppError("Invoice not found", 404);
    }
    const successfulPayments = await tx.payment.findMany({
        where: {
            invoiceId,
            status: PaymentStatus.SUCCESS,
        },
        select: {
            amount: true,
        },
    });
    const paidAmount = successfulPayments.reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
    let status;
    if (paidAmount.gte(invoice.totalAmount)) {
        status =
            InvoiceStatus.PAID;
    }
    else if (paidAmount.gt(0)) {
        status =
            InvoiceStatus.PARTIALLY_PAID;
    }
    else {
        status =
            InvoiceStatus.UNPAID;
    }
    await tx.invoice.update({
        where: {
            id: invoiceId,
        },
        data: {
            status,
            paidAt: status ===
                InvoiceStatus.PAID
                ? new Date()
                : null,
        },
    });
    return {
        status,
        paidAmount,
        totalAmount: invoice.totalAmount,
    };
};
export const reconcilePayment = async (paymentId, actorId, ipAddress, userAgent) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
        select: {
            id: true,
            invoiceId: true,
            transactionId: true,
            gateway: true,
            amount: true,
            currency: true,
            status: true,
            gatewayTransactionId: true,
            metadata: true,
            invoice: {
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    student: {
                        select: {
                            userId: true,
                        },
                    },
                },
            },
        },
    });
    if (!payment) {
        throw new AppError("Payment not found", 404);
    }
    if (payment.gateway !==
        PaymentGateway.SSLCOMMERZ) {
        throw new AppError("Payment reconciliation is only supported for SSLCommerz payments", 400);
    }
    if (payment.status ===
        PaymentStatus.CANCELLED) {
        throw new AppError("Cancelled payments cannot be reconciled", 400);
    }
    const gateway = await querySSLCommerzTransaction(payment.transactionId);
    const gatewayStatus = gateway.status?.toUpperCase() ??
        null;
    const gatewayTransactionId = gateway.bank_tran_id ?? null;
    const gatewayAmount = gateway.amount !== undefined
        ? toNumber(gateway.amount)
        : null;
    const localAmount = toNumber(payment.amount);
    const amountMatches = gatewayAmount !== null &&
        Math.abs(gatewayAmount -
            localAmount) < 0.01;
    const currencyMatches = gateway.currency?.toUpperCase() ===
        payment.currency.toUpperCase();
    const transactionMatches = gateway.tran_id ===
        payment.transactionId;
    const isValid = (gatewayStatus ===
        "VALID" ||
        gatewayStatus ===
            "VALIDATED") &&
        amountMatches &&
        currencyMatches &&
        transactionMatches;
    /*
     * Gateway response is not valid enough
     * to mark the local payment successful.
     */
    if (!isValid) {
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: payment.invoiceId,
            },
            select: {
                id: true,
                status: true,
                totalAmount: true,
            },
        });
        if (!invoice) {
            throw new AppError("Invoice not found", 404);
        }
        const successfulPayments = await prisma.payment.findMany({
            where: {
                invoiceId: payment.invoiceId,
                status: PaymentStatus.SUCCESS,
            },
            select: {
                amount: true,
            },
        });
        const paidAmount = successfulPayments.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0));
        return {
            paymentId: payment.id,
            transactionId: payment.transactionId,
            localStatus: payment.status,
            gatewayStatus,
            reconciled: false,
            changed: false,
            amount: payment.amount.toString(),
            currency: payment.currency,
            gatewayTransactionId,
            invoice: {
                id: invoice.id,
                status: invoice.status,
                paidAmount: paidAmount.toString(),
                totalAmount: invoice.totalAmount.toString(),
            },
        };
    }
    /*
     * Successful reconciliation.
     *
     * Payment state and invoice state are
     * updated atomically.
     */
    const result = await prisma.$transaction(async (tx) => {
        /*
         * Serialize all payment changes
         * for the same invoice.
         */
        await tx.$executeRaw `
          SELECT pg_advisory_xact_lock(
            hashtextextended(
              ${payment.invoiceId},
              0
            )
          )
        `;
        const currentPayment = await tx.payment.findUnique({
            where: {
                id: payment.id,
            },
            select: {
                id: true,
                invoiceId: true,
                transactionId: true,
                status: true,
                amount: true,
                currency: true,
                gatewayTransactionId: true,
                metadata: true,
            },
        });
        if (!currentPayment) {
            throw new AppError("Payment not found", 404);
        }
        /*
         * Already successful means reconciliation
         * did not cause a new SUCCESS transition.
         *
         * Therefore:
         * - changed = false
         * - no duplicate notification
         */
        if (currentPayment.status ===
            PaymentStatus.SUCCESS) {
            const invoiceStatus = await recalculateInvoiceStatus(tx, payment.invoiceId);
            return {
                changed: false,
                invoice: invoiceStatus,
            };
        }
        /*
         * Never resurrect a cancelled or failed
         * local payment through reconciliation.
         */
        if (currentPayment.status ===
            PaymentStatus.CANCELLED ||
            currentPayment.status ===
                PaymentStatus.FAILED) {
            throw new AppError("A cancelled or failed payment cannot be reconciled as successful", 409);
        }
        const updatedPayment = await tx.payment.update({
            where: {
                id: currentPayment.id,
            },
            data: {
                status: PaymentStatus.SUCCESS,
                gatewayTransactionId,
                completedAt: new Date(),
                failedAt: null,
                failureReason: null,
                metadata: {
                    ...(currentPayment.metadata &&
                        typeof currentPayment.metadata ===
                            "object" &&
                        !Array.isArray(currentPayment.metadata)
                        ? currentPayment.metadata
                        : {}),
                    reconciliation: {
                        reconciledAt: new Date().toISOString(),
                        gatewayStatus,
                        gatewayTransactionId,
                    },
                },
            },
        });
        const invoiceStatus = await recalculateInvoiceStatus(tx, payment.invoiceId);
        /*
         * Audit only the actual state-changing
         * reconciliation.
         */
        await tx.auditLog.create({
            data: {
                actorId,
                action: "PAYMENT_RECONCILED",
                entity: "Payment",
                entityId: payment.id,
                oldValue: {
                    status: currentPayment.status,
                    invoiceId: payment.invoiceId,
                    transactionId: payment.transactionId,
                },
                newValue: {
                    status: PaymentStatus.SUCCESS,
                    gatewayStatus,
                    gatewayTransactionId,
                    invoiceStatus: invoiceStatus.status,
                    paidAmount: invoiceStatus.paidAmount.toString(),
                    totalAmount: invoiceStatus.totalAmount.toString(),
                },
                ...(ipAddress !==
                    undefined
                    ? {
                        ipAddress,
                    }
                    : {}),
                ...(userAgent !==
                    undefined
                    ? {
                        userAgent,
                    }
                    : {}),
            },
        });
        return {
            payment: updatedPayment,
            changed: true,
            invoice: invoiceStatus,
        };
    });
    /*
     * Notify only when reconciliation itself
     * caused the payment to become SUCCESS.
     *
     * If the payment was already SUCCESS,
     * result.changed === false and no notification
     * is created.
     */
    if (result.changed) {
        const notification = paymentSuccessfulNotification(payment.transactionId, payment.amount.toString());
        const studentUserId = payment.invoice.student.userId;
        if (studentUserId) {
            await sendNotification({
                userId: studentUserId,
                ...notification,
            });
        }
        else {
            console.error("Reconciled payment succeeded but student user was not found for notification:", payment.id);
        }
    }
    return {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        localStatus: PaymentStatus.SUCCESS,
        gatewayStatus,
        reconciled: true,
        changed: result.changed,
        amount: payment.amount.toString(),
        currency: payment.currency,
        gatewayTransactionId,
        invoice: {
            id: payment.invoiceId,
            status: result.invoice.status,
            paidAmount: result.invoice.paidAmount.toString(),
            totalAmount: result.invoice.totalAmount.toString(),
        },
    };
};
//# sourceMappingURL=payment.reconciliation.service.js.map