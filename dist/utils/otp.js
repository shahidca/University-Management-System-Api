import crypto from "node:crypto";
export const generateOtp = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};
export const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};
export const getOtpExpiry = (minutes = 10) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
};
//# sourceMappingURL=otp.js.map