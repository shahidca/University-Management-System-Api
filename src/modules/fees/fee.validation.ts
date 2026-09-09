import { z } from "zod";

const decimalAmountSchema = z
  .coerce
  .number()
  .finite()
  .positive("Amount must be greater than zero")
  .refine(
    (value) => Number.isInteger(value * 100),
    "Amount can have at most 2 decimal places",
  );

export const createFeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Fee name must be at least 2 characters")
    .max(100, "Fee name must not exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Fee code must be at least 2 characters")
    .max(30, "Fee code must not exceed 30 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Fee code may contain only uppercase letters, numbers, underscores, and hyphens",
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  amount: decimalAmountSchema,

  isActive: z.boolean().optional(),
});

export const updateFeeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Fee name must be at least 2 characters")
      .max(100, "Fee name must not exceed 100 characters")
      .optional(),

    code: z
      .string()
      .trim()
      .min(2, "Fee code must be at least 2 characters")
      .max(30, "Fee code must not exceed 30 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Fee code may contain only uppercase letters, numbers, underscores, and hyphens",
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),

    amount: decimalAmountSchema.optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required for update",
  );

export const feeIdParamSchema = z.object({
  id: z.string().uuid("Invalid fee ID"),
});

export const feeListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(20),

  search: z
    .string()
    .trim()
    .max(100)
    .optional(),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  sortBy: z
    .enum([
      "name",
      "code",
      "amount",
      "createdAt",
      "updatedAt",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type CreateFeeInput = z.infer<
  typeof createFeeSchema
>;

export type UpdateFeeInput = z.infer<
  typeof updateFeeSchema
>;

export type FeeIdParam = z.infer<
  typeof feeIdParamSchema
>;

export type FeeListQuery = z.infer<
  typeof feeListQuerySchema
>;