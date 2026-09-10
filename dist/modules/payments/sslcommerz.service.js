import axios from "axios";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
const getBaseUrl = () => {
    return env.SSLCOMMERZ_BASE_URL.replace(/\/+$/, "");
};
const getInitiationUrl = () => {
    return `${getBaseUrl()}/gwprocess/v4/api.php`;
};
const getValidationUrl = () => {
    const baseUrl = getBaseUrl();
    return env.SSLCOMMERZ_IS_LIVE
        ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
        : `${baseUrl}/validator/api/validationserverAPI.php`;
};
export const initiateSSLCommerzPayment = async (input) => {
    const payload = new URLSearchParams();
    payload.append("store_id", env.SSLCOMMERZ_STORE_ID);
    payload.append("store_passwd", env.SSLCOMMERZ_STORE_PASSWORD);
    payload.append("total_amount", input.amount);
    payload.append("currency", input.currency);
    payload.append("tran_id", input.transactionId);
    payload.append("success_url", env.SSLCOMMERZ_SUCCESS_URL);
    payload.append("fail_url", env.SSLCOMMERZ_FAIL_URL);
    payload.append("cancel_url", env.SSLCOMMERZ_CANCEL_URL);
    payload.append("ipn_url", env.SSLCOMMERZ_IPN_URL);
    payload.append("product_name", `University Fee - ${input.invoiceNumber}`);
    payload.append("product_category", "University Fee");
    payload.append("product_profile", "general");
    payload.append("cus_name", input.customerName);
    payload.append("cus_email", input.customerEmail);
    payload.append("cus_phone", input.customerPhone);
    payload.append("cus_add1", input.customerAddress);
    payload.append("cus_city", "Dhaka");
    payload.append("cus_country", "Bangladesh");
    payload.append("shipping_method", "NO");
    payload.append("num_of_item", "1");
    try {
        const response = await axios.post(getInitiationUrl(), payload.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 30_000,
        });
        const data = response.data;
        if (data.status !== "SUCCESS" ||
            !data.GatewayPageURL) {
            throw new AppError(data.failedreason ||
                "SSLCommerz payment initialization failed", 502);
        }
        return data;
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (axios.isAxiosError(error)) {
            throw new AppError("Unable to connect to SSLCommerz", 502, [
                {
                    provider: "SSLCommerz",
                    status: error.response?.status ?? null,
                },
            ]);
        }
        throw error;
    }
};
export const validateSSLCommerzPayment = async (validationId) => {
    try {
        const response = await axios.get(getValidationUrl(), {
            params: {
                val_id: validationId,
                store_id: env.SSLCOMMERZ_STORE_ID,
                store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
                format: "json",
            },
            timeout: 30_000,
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new AppError("Unable to validate SSLCommerz transaction", 502, [
                {
                    provider: "SSLCommerz",
                    status: error.response?.status ?? null,
                },
            ]);
        }
        throw error;
    }
};
//# sourceMappingURL=sslcommerz.service.js.map