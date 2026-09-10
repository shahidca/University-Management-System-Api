interface SSLCommerzInitInput {
    transactionId: string;
    amount: string;
    currency: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
}
export interface SSLCommerzInitResponse {
    status: string;
    failedreason?: string;
    sessionkey?: string;
    GatewayPageURL?: string;
    GatewayPageURLFailed?: string;
    tran_id?: string;
}
export interface SSLCommerzValidationResponse {
    status: string;
    tran_id?: string;
    val_id?: string;
    amount?: string;
    currency?: string;
    bank_tran_id?: string;
    card_type?: string;
    card_brand?: string;
    risk_level?: string;
    risk_title?: string;
}
export declare const initiateSSLCommerzPayment: (input: SSLCommerzInitInput) => Promise<SSLCommerzInitResponse>;
export declare const validateSSLCommerzPayment: (validationId: string) => Promise<SSLCommerzValidationResponse>;
export {};
//# sourceMappingURL=sslcommerz.service.d.ts.map