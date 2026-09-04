import { z } from "zod";
export const createStudentProfileSchema = z.object({
    programId: z
        .string()
        .trim()
        .min(1, "Program ID is required"),
    dateOfBirth: z
        .string()
        .datetime({
        message: "Invalid date of birth",
    })
        .optional(),
    phone: z
        .string()
        .trim()
        .min(7, "Phone number is too short")
        .max(20, "Phone number is too long")
        .optional(),
    address: z
        .string()
        .trim()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
});
export const updateStudentProfileSchema = z
    .object({
    dateOfBirth: z
        .string()
        .datetime({
        message: "Invalid date of birth",
    })
        .optional(),
    phone: z
        .string()
        .trim()
        .min(7, "Phone number is too short")
        .max(20, "Phone number is too long")
        .optional(),
    address: z
        .string()
        .trim()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
//# sourceMappingURL=student.validation.js.map