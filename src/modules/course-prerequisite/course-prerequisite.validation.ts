import { z } from "zod";

export const createCoursePrerequisiteSchema =
  z.object({
    courseId: z
      .string()
      .trim()
      .min(1, "Course ID is required"),

    prerequisiteId: z
      .string()
      .trim()
      .min(1, "Prerequisite course ID is required"),

    minimumGrade: z
      .string()
      .trim()
      .min(1)
      .max(10)
      .optional(),
  });

export const updateCoursePrerequisiteSchema =
  z
    .object({
      minimumGrade: z
        .string()
        .trim()
        .min(1)
        .max(10)
        .nullable()
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field is required",
      },
    );

export const prerequisiteListQuerySchema =
  z.object({
    courseId: z
      .string()
      .trim()
      .optional(),

    prerequisiteId: z
      .string()
      .trim()
      .optional(),

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
  });

export type CreateCoursePrerequisiteInput =
  z.infer<
    typeof createCoursePrerequisiteSchema
  >;

export type UpdateCoursePrerequisiteInput =
  z.infer<
    typeof updateCoursePrerequisiteSchema
  >;

export type PrerequisiteListQueryInput =
  z.infer<
    typeof prerequisiteListQuerySchema
  >;