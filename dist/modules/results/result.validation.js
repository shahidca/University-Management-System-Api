import { z } from "zod";
export const createResultSchema = z.object({
    examId: z.string().uuid(),
    enrollmentId: z.string().uuid(),
    marksObtained: z.coerce
        .number()
        .min(0)
        .max(999999.99),
    remarks: z
        .string()
        .trim()
        .max(1000)
        .optional(),
});
export const updateResultSchema = z
    .object({
    marksObtained: z.coerce
        .number()
        .min(0)
        .max(999999.99)
        .optional(),
    remarks: z
        .string()
        .trim()
        .max(1000)
        .nullable()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const resultListQuerySchema = z.object({
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
    examId: z
        .string()
        .uuid()
        .optional(),
    enrollmentId: z
        .string()
        .uuid()
        .optional(),
    studentId: z
        .string()
        .uuid()
        .optional(),
    sectionId: z
        .string()
        .uuid()
        .optional(),
    status: z.enum([
        "DRAFT",
        "SUBMITTED",
        "APPROVED",
        "PUBLISHED",
    ]).optional(),
    grade: z
        .string()
        .trim()
        .max(10)
        .optional(),
    search: z
        .string()
        .trim()
        .max(100)
        .optional(),
    sortBy: z.enum([
        "marksObtained",
        "grade",
        "gradePoint",
        "status",
        "createdAt",
        "updatedAt",
    ]).default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=result.validation.js.map