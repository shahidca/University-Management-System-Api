import { z } from "zod";
export declare const createStudentProfileSchema: z.ZodObject<{
    programId: z.ZodString;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateStudentProfileSchema: z.ZodObject<{
    dateOfBirth: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateStudentProfileInput = z.infer<typeof createStudentProfileSchema>;
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
//# sourceMappingURL=student.validation.d.ts.map