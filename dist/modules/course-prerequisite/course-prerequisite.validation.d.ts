import { z } from "zod";
export declare const createCoursePrerequisiteSchema: z.ZodObject<{
    courseId: z.ZodString;
    prerequisiteId: z.ZodString;
    minimumGrade: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCoursePrerequisiteSchema: z.ZodObject<{
    minimumGrade: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const prerequisiteListQuerySchema: z.ZodObject<{
    courseId: z.ZodOptional<z.ZodString>;
    prerequisiteId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateCoursePrerequisiteInput = z.infer<typeof createCoursePrerequisiteSchema>;
export type UpdateCoursePrerequisiteInput = z.infer<typeof updateCoursePrerequisiteSchema>;
export type PrerequisiteListQueryInput = z.infer<typeof prerequisiteListQuerySchema>;
//# sourceMappingURL=course-prerequisite.validation.d.ts.map