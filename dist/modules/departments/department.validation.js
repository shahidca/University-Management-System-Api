import { z } from "zod";
export const createDepartmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Department name must be at least 2 characters")
        .max(100, "Department name must not exceed 100 characters"),
    code: z
        .string()
        .trim()
        .min(2, "Department code must be at least 2 characters")
        .max(20, "Department code must not exceed 20 characters")
        .toUpperCase(),
    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
});
export const updateDepartmentSchema = createDepartmentSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const departmentListQuerySchema = z.object({
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
    sortBy: z
        .enum(["name", "code", "createdAt"])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=department.validation.js.map