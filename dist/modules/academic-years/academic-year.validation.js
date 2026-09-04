import { z } from "zod";
export const createAcademicYearSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(4, "Academic year name must be at least 4 characters")
        .max(50, "Academic year name must not exceed 50 characters"),
    startDate: z
        .string()
        .datetime({
        message: "Invalid start date",
    }),
    endDate: z
        .string()
        .datetime({
        message: "Invalid end date",
    }),
})
    .refine((data) => new Date(data.startDate) <
    new Date(data.endDate), {
    message: "Start date must be before end date",
    path: ["endDate"],
});
export const updateAcademicYearSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(4, "Academic year name must be at least 4 characters")
        .max(50, "Academic year name must not exceed 50 characters")
        .optional(),
    startDate: z
        .string()
        .datetime({
        message: "Invalid start date",
    })
        .optional(),
    endDate: z
        .string()
        .datetime({
        message: "Invalid end date",
    })
        .optional(),
    isActive: z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const academicYearListQuerySchema = z.object({
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
        .max(50)
        .optional(),
    isActive: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    sortBy: z
        .enum([
        "name",
        "startDate",
        "endDate",
        "createdAt",
    ])
        .default("startDate"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=academic-year.validation.js.map