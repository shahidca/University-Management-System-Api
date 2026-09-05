import { z } from "zod";
export const createEnrollmentSchema = z.object({
    sectionId: z
        .string()
        .uuid(),
});
export const updateEnrollmentStatusSchema = z.object({
    status: z.enum([
        "ENROLLED",
        "DROPPED",
        "REJECTED",
    ]),
});
export const enrollmentListQuerySchema = z.object({
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
    studentId: z
        .string()
        .uuid()
        .optional(),
    sectionId: z
        .string()
        .uuid()
        .optional(),
    status: z
        .enum([
        "PENDING",
        "ENROLLED",
        "DROPPED",
        "COMPLETED",
        "REJECTED",
    ])
        .optional(),
    sortBy: z
        .enum([
        "createdAt",
        "enrolledAt",
        "droppedAt",
        "status",
    ])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=enrollment.validation.js.map