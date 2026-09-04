import { z } from "zod";

export const createCourseOfferingSchema =
  z.object({
    courseId: z
      .string()
      .trim()
      .min(1, "Course ID is required"),

    semesterId: z
      .string()
      .trim()
      .min(1, "Semester ID is required"),

    code: z
      .string()
      .trim()
      .min(2, "Offering code is required")
      .max(50)
      .toUpperCase(),

    title: z
      .string()
      .trim()
      .min(2, "Offering title is required")
      .max(200),

    credits: z
      .number()
      .positive()
      .max(99.99),
  });

export const updateCourseOfferingSchema =
  z
    .object({
      code: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .toUpperCase()
        .optional(),

      title: z
        .string()
        .trim()
        .min(2)
        .max(200)
        .optional(),

      credits: z
        .number()
        .positive()
        .max(99.99)
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

export const courseOfferingListQuerySchema =
  z.object({
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

    courseId: z
      .string()
      .trim()
      .optional(),

    semesterId: z
      .string()
      .trim()
      .optional(),

    isActive: z
      .enum(["true", "false"])
      .transform(
        (value) => value === "true",
      )
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
        "createdAt",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export type CreateCourseOfferingInput =
  z.infer<
    typeof createCourseOfferingSchema
  >;

export type UpdateCourseOfferingInput =
  z.infer<
    typeof updateCourseOfferingSchema
  >;

export type CourseOfferingListQueryInput =
  z.infer<
    typeof courseOfferingListQuerySchema
  >;