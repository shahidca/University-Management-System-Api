import { InvoiceStatus, PaymentGateway, PaymentStatus, Prisma, } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { initiateSSLCommerzPayment, } from "./sslcommerz.service.js";
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
};
const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
};
const getOutstandingAmount = (invoice, successfulPayments) => {
    const paidAmount = successfulPayments.reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
    return invoice.totalAmount.sub(paidAmount);
};
export const initiatePayment = async (input, actorId) => {
    /*
     * At the moment SSLCommerz is the only
     * implemented payment gateway.
     */
    if (input.gateway !==
        PaymentGateway.SSLCOMMERZ) {
        throw new AppError("Only SSLCommerz is currently implemented", 400);
    }
    const payment = await prisma.$transaction(async (tx) => {
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
            throw new AppError("Invoice not found", 404);
        }
        if (invoice.status ===
            InvoiceStatus.CANCELLED) {
            throw new AppError("Payment cannot be initiated for a cancelled invoice", 409);
        }
        if (invoice.status ===
            InvoiceStatus.PAID) {
            throw new AppError("Invoice has already been fully paid", 409);
        }
        /*
         * Prevent creating another payment
         * while an existing payment is still
         * waiting for gateway completion.
         */
        const existingPendingPayment = await tx.payment.findFirst({
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
            select: {
                id: true,
                invoiceId: true,
                transactionId: true,
                gateway: true,
                amount: true,
                currency: true,
                status: true,
                paymentUrl: true,
                metadata: true,
            },
        });
        if (existingPendingPayment) {
            return existingPendingPayment;
        }
        const outstandingAmount = getOutstandingAmount(invoice, invoice.payments);
        if (outstandingAmount.lessThanOrEqualTo(0)) {
            throw new AppError("Invoice has no outstanding amount", 409);
        }
        let transactionId = generateTransactionId();
        let createdPayment;
        /*
         * transactionId is unique.
         *
         * In the extremely unlikely event of a
         * collision, generate another ID and retry.
         */
        for (let attempt = 0; attempt < 5; attempt += 1) {
            try {
                createdPayment =
                    await tx.payment.create({
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
                        select: {
                            id: true,
                            invoiceId: true,
                            transactionId: true,
                            gateway: true,
                            amount: true,
                            currency: true,
                            status: true,
                            paymentUrl: true,
                            metadata: true,
                        },
                    });
                break;
            }
            catch (error) {
                if (error instanceof
                    Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002") {
                    transactionId =
                        generateTransactionId();
                    continue;
                }
                throw error;
            }
        }
        if (!createdPayment) {
            throw new AppError("Unable to generate a unique transaction ID", 500);
        }
        return createdPayment;
    });
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
        throw new AppError("Invoice not found", 404);
    }
    const customerName = `${invoice.student.firstName} ${invoice.student.lastName}`.trim();
    const customerEmail = invoice.student.user.email;
    /*
     * SSLCommerz requires customer phone
     * information, so don't use a fake
     * fallback number.
     */
    if (!invoice.student.phone) {
        await prisma.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.FAILED,
                failedAt: new Date(),
                failureReason: "Student phone number is required for payment initiation",
            },
        });
        throw new AppError("Student phone number is required before initiating payment", 400);
    }
    const customerPhone = invoice.student.phone;
    const customerAddress = invoice.student.address ??
        "Bangladesh";
    try {
        const gateway = await initiateSSLCommerzPayment({
            transactionId: payment.transactionId,
            amount: payment.amount.toString(),
            currency: payment.currency,
            invoiceNumber: invoice.invoiceNumber,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
        });
        const paymentUrl = gateway.GatewayPageURL;
        if (!paymentUrl) {
            throw new AppError("SSLCommerz did not return a payment URL", 502);
        }
        /*
         * payment.metadata is now included
         * in the transaction select above.
         */
        const existingMetadata = typeof payment.metadata ===
            "object" &&
            payment.metadata !== null
            ? payment.metadata
            : {};
        const updatedPayment = await prisma.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.PROCESSING,
                paymentUrl,
                ...(gateway.tran_id
                    ? {
                        gatewayTransactionId: gateway.tran_id,
                    }
                    : {}),
                metadata: {
                    ...existingMetadata,
                    sslcommerz: {
                        sessionkey: gateway.sessionkey ??
                            null,
                        status: gateway.status,
                    },
                },
            },
            select: {
                id: true,
                transactionId: true,
                invoiceId: true,
                gateway: true,
                amount: true,
                currency: true,
                status: true,
                paymentUrl: true,
            },
        });
        return {
            paymentId: updatedPayment.id,
            transactionId: updatedPayment.transactionId,
            invoiceId: updatedPayment.invoiceId,
            gateway: updatedPayment.gateway,
            amount: updatedPayment.amount.toString(),
            currency: updatedPayment.currency,
            status: updatedPayment.status,
            paymentUrl: updatedPayment.paymentUrl,
        };
    }
    catch (error) {
        /*
         * If gateway initialization fails,
         * mark the local payment as FAILED.
         */
        await prisma.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.FAILED,
                failedAt: new Date(),
                failureReason: error instanceof Error
                    ? error.message
                    : "Payment gateway initialization failed",
            },
        });
        throw error;
    }
};
export const getPayments = async (query) => {
    const { page, limit, invoiceId, status, gateway, transactionId, search, sortBy, sortOrder, } = query;
    const skip = (page - 1) * limit;
    const where = {};
    if (invoiceId) {
        where.invoiceId =
            invoiceId;
    }
    if (status) {
        where.status =
            status;
    }
    if (gateway) {
        where.gateway =
            gateway;
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
    };
    const [payments, total] = await prisma.$transaction([
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
export const getPaymentById = async (id) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id,
        },
        select: paymentSelect,
    });
    if (!payment) {
        throw new AppError("Payment not found", 404);
    }
    return payment;
};
export const getPaymentByTransactionId = async (transactionId) => {
    const payment = await prisma.payment.findUnique({
        where: {
            transactionId,
        },
        select: paymentSelect,
    });
    if (!payment) {
        throw new AppError("Payment not found", 404);
    }
    return payment;
};
//# sourceMappingURL=payment.service.js.map