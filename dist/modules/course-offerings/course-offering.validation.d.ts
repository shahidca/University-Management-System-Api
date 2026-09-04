import { z } from "zod";
export declare const createCourseOfferingSchema: z.ZodObject<{
    courseId: z.ZodString;
    semesterId: z.ZodString;
    code: z.ZodString;
    title: z.ZodString;
    credits: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCourseOfferingSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    credits: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const courseOfferingListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    courseId: z.ZodOptional<z.ZodString>;
    semesterId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        code: "code";
        createdAt: "createdAt";
        credits: "credits";
        title: "title";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateCourseOfferingInput = z.infer<typeof createCourseOfferingSchema>;
export type UpdateCourseOfferingInput = z.infer<typeof updateCourseOfferingSchema>;
export type CourseOfferingListQueryInput = z.infer<typeof courseOfferingListQuerySchema>;
//# sourceMappingURL=course-offering.validation.d.ts.map