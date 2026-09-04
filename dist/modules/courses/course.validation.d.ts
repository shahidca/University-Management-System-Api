import { z } from "zod";
export declare const createCourseSchema: z.ZodObject<{
    departmentId: z.ZodString;
    code: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    credits: z.ZodNumber;
    courseType: z.ZodDefault<z.ZodEnum<{
        LAB: "LAB";
        PROJECT: "PROJECT";
        SEMINAR: "SEMINAR";
        THEORY: "THEORY";
        THESIS: "THESIS";
    }>>;
    level: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCourseSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    credits: z.ZodOptional<z.ZodNumber>;
    courseType: z.ZodOptional<z.ZodEnum<{
        LAB: "LAB";
        PROJECT: "PROJECT";
        SEMINAR: "SEMINAR";
        THEORY: "THEORY";
        THESIS: "THESIS";
    }>>;
    level: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const courseListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    departmentId: z.ZodOptional<z.ZodString>;
    courseType: z.ZodOptional<z.ZodEnum<{
        LAB: "LAB";
        PROJECT: "PROJECT";
        SEMINAR: "SEMINAR";
        THEORY: "THEORY";
        THESIS: "THESIS";
    }>>;
    level: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        code: "code";
        courseType: "courseType";
        createdAt: "createdAt";
        credits: "credits";
        level: "level";
        title: "title";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseListQueryInput = z.infer<typeof courseListQuerySchema>;
//# sourceMappingURL=course.validation.d.ts.map