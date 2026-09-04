import { z } from "zod";
export const createProgramSchema = z.object({
    departmentId: z
        .string()
        .trim()
        .min(1, "Department ID is required"),
    name: z
        .string()
        .trim()
        .min(2, "Program name must be at least 2 characters")
        .max(150, "Program name must not exceed 150 characters"),
    code: z
        .string()
        .trim()
        .min(2, "Program code must be at least 2 characters")
        .max(30, "Program code must not exceed 30 characters")
        .toUpperCase(),
    degree: z
        .string()
        .trim()
        .min(2, "Degree must be at least 2 characters")
        .max(100, "Degree must not exceed 100 characters"),
    durationYears: z
        .number()
        .int()
        .min(1)
        .max(10),
    totalCredits: z
        .number()
        .positive()
        .max(999.99),
    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),
});
export const updateProgramSchema = createProgramSchema
    .omit({
    departmentId: true,
})
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const programListQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),
    search: z
        .string()
        .trim()
        .max(100)
        .optional(),
    departmentId: z
        .string()
        .trim()
        .optional(),
    degree: z
        .string()
        .trim()
        .max(100)
        .optional(),
    isActive: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    sortBy: z.enum([
        "name",
        "code",
        "degree",
        "durationYears",
        "totalCredits",
        "createdAt",
    ]).default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=program.validation.js.map