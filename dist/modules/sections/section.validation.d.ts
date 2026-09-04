import { z } from "zod";
export declare const createSectionSchema: z.ZodObject<{
    courseOfferingId: z.ZodString;
    instructorId: z.ZodString;
    sectionCode: z.ZodString;
    name: z.ZodString;
    capacity: z.ZodNumber;
}, z.core.$strip>;
export declare const updateSectionSchema: z.ZodObject<{
    instructorId: z.ZodOptional<z.ZodString>;
    sectionCode: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const sectionListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    courseOfferingId: z.ZodOptional<z.ZodString>;
    instructorId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        capacity: "capacity";
        createdAt: "createdAt";
        enrolledCount: "enrolledCount";
        name: "name";
        sectionCode: "sectionCode";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type SectionListQueryInput = z.infer<typeof sectionListQuerySchema>;
//# sourceMappingURL=section.validation.d.ts.map