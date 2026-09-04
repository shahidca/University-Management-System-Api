import { z } from "zod";
const courseTypes = [
    "THEORY",
    "LAB",
    "PROJECT",
    "SEMINAR",
    "THESIS",
];
export const createCourseSchema = z.object({
    departmentId: z
        .string()
        .trim()
        .min(1, "Department ID is required"),
    code: z
        .string()
        .trim()
        .min(2, "Course code must be at least 2 characters")
        .max(30, "Course code must not exceed 30 characters")
        .toUpperCase(),
    title: z
        .string()
        .trim()
        .min(2, "Course title must be at least 2 characters")
        .max(200, "Course title must not exceed 200 characters"),
    description: z
        .string()
        .trim()
        .max(2000, "Description must not exceed 2000 characters")
        .optional(),
    credits: z
        .number()
        .positive()
        .max(99.99),
    courseType: z
        .enum(courseTypes)
        .default("THEORY"),
    level: z
        .number()
        .int()
        .min(1, "Course level must be at least 1")
        .max(12, "Course level must not exceed 12"),
});
export const updateCourseSchema = z
    .object({
    code: z
        .string()
        .trim()
        .min(2, "Course code must be at least 2 characters")
        .max(30, "Course code must not exceed 30 characters")
        .toUpperCase()
        .optional(),
    title: z
        .string()
        .trim()
        .min(2, "Course title must be at least 2 characters")
        .max(200, "Course title must not exceed 200 characters")
        .optional(),
    description: z
        .string()
        .trim()
        .max(2000, "Description must not exceed 2000 characters")
        .optional(),
    credits: z
        .number()
        .positive()
        .max(99.99)
        .optional(),
    courseType: z
        .enum(courseTypes)
        .optional(),
    level: z
        .number()
        .int()
        .min(1)
        .max(12)
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const courseListQuerySchema = z.object({
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
    departmentId: z
        .string()
        .trim()
        .optional(),
    courseType: z
        .enum(courseTypes)
        .optional(),
    level: z.coerce
        .number()
        .int()
        .min(1)
        .max(12)
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
        "code",
        "title",
        "credits",
        "courseType",
        "level",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=course.validation.js.map