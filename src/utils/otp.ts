import crypto from "node:crypto";

export const generateOtp = (): string => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

export const hashOtp = (otp: string): string => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export const getOtpExpiry = (
  minutes = 10,
): Date => {
  const expiresAt = new Date();

  expiresAt.setMinutes(
    expiresAt.getMinutes() + minutes,
  );

  return expiresAt;
};