import { z } from "zod";
export const createSectionSchema = z.object({
    courseOfferingId: z
        .string()
        .trim()
        .min(1, "Course offering ID is required"),
    instructorId: z
        .string()
        .trim()
        .min(1, "Instructor ID is required"),
    sectionCode: z
        .string()
        .trim()
        .min(1, "Section code is required")
        .max(30, "Section code must not exceed 30 characters")
        .toUpperCase(),
    name: z
        .string()
        .trim()
        .min(2, "Section name must be at least 2 characters")
        .max(100, "Section name must not exceed 100 characters"),
    capacity: z
        .number()
        .int()
        .min(1, "Section capacity must be at least 1")
        .max(1000, "Section capacity must not exceed 1000"),
});
export const updateSectionSchema = z
    .object({
    instructorId: z
        .string()
        .trim()
        .min(1)
        .optional(),
    sectionCode: z
        .string()
        .trim()
        .min(1)
        .max(30)
        .toUpperCase()
        .optional(),
    name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    capacity: z
        .number()
        .int()
        .min(1)
        .max(1000)
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const sectionListQuerySchema = z.object({
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
    courseOfferingId: z
        .string()
        .trim()
        .optional(),
    instructorId: z
        .string()
        .trim()
        .optional(),
    isActive: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    search: z
        .string()
        .trim()
        .max(100)
        .optional(),
    sortBy: z
        .enum([
        "sectionCode",
        "name",
        "capacity",
        "enrolledCount",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=section.validation.js.map