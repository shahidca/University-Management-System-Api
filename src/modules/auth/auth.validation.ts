import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters"),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must not exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must not exceed 50 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  newPassword: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters long",
    )
    .max(
      128,
      "Password must not exceed 128 characters",
    ),
});

export type RegisterSchemaInput =
  z.infer<typeof registerSchema>;

export type LoginSchemaInput =
  z.infer<typeof loginSchema>;

export type RefreshTokenSchemaInput =
  z.infer<typeof refreshTokenSchema>;

export type LogoutSchemaInput =
  z.infer<typeof logoutSchema>;

  export type VerifyEmailSchemaInput =
  z.infer<typeof verifyEmailSchema>;

  export type ResendVerificationSchemaInput =
  z.infer<typeof resendVerificationSchema>;

  export type ForgotPasswordSchemaInput =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordSchemaInput =
  z.infer<typeof resetPasswordSchema>;