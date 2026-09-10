import type { RequestHandler } from "express";
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
export declare const sslCommerzIpnController: RequestHandler;
/**
 * SSLCommerz success callback.
 *
 * IMPORTANT:
 * This endpoint does NOT mark the payment successful.
 * The IPN/validation flow is responsible for that.
 */
export declare const sslCommerzSuccessController: RequestHandler;
/**
 * SSLCommerz failure callback.
 *
 * IMPORTANT:
 * This endpoint does NOT directly change
 * the local payment status.
 */
export declare const sslCommerzFailController: RequestHandler;
/**
 * SSLCommerz cancellation callback.
 *
 * IMPORTANT:
 * This endpoint does NOT directly change
 * the local payment status.
 */
export declare const sslCommerzCancelController: RequestHandler;
//# sourceMappingURL=payment.webhook.controller.d.ts.map