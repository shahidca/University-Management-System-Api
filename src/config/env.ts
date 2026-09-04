import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(4000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(
      32,
      "JWT_ACCESS_SECRET must be at least 32 characters",
    ),

  JWT_REFRESH_SECRET: z
    .string()
    .min(
      32,
      "JWT_REFRESH_SECRET must be at least 32 characters",
    ),

  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .default("15m"),

  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default("7d"),

  SMTP_HOST: z
    .string()
    .min(1, "SMTP_HOST is required"),

  SMTP_PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(587),

  SMTP_USER: z
    .string()
    .email("SMTP_USER must be a valid email address"),

  SMTP_PASSWORD: z
    .string()
    .min(1, "SMTP_PASSWORD is required"),

  SMTP_FROM: z
    .string()
    .min(1, "SMTP_FROM is required"),

  GOOGLE_CLIENT_ID: z
  .string()
  .min(1, "Google Client ID is required"),
    
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsedEnv.data;