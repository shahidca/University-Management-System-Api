import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateCourseOfferingInput,
  CourseOfferingListQueryInput,
  UpdateCourseOfferingInput,
} from "./course-offering.validation.js";

const courseSelect = {
  id: true,
  code: true,
  title: true,
  credits: true,
  courseType: true,
  level: true,
  isActive: true,
  deletedAt: true,
} satisfies Prisma.CourseSelect;

const semesterSelect = {
  id: true,
  academicYearId: true,
  name: true,
  code: true,
  type: true,
  status: true,
  startDate: true,
  endDate: true,
  registrationOpen: true,
  registrationClose: true,
} satisfies Prisma.SemesterSelect;

const ensureActiveCourse = async (
  courseId: string,
) => {
  const course =
    await prisma.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
        deletedAt: null,
      },

      select: courseSelect,
    });

  if (!course) {
    throw new AppError(
      "Course not found or inactive",
      404,
    );
  }

  return course;
};

const ensureValidSemester = async (
  semesterId: string,
) => {
  const semester =
    await prisma.semester.findUnique({
      where: {
        id: semesterId,
      },

      select: semesterSelect,
    });

  if (!semester) {
    throw new AppError(
      "Semester not found",
      404,
    );
  }

  if (
    semester.status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot create an offering for a completed semester",
      409,
    );
  }

  return semester;
};

export const createCourseOffering =
  async (
    input: CreateCourseOfferingInput,
  ) => {
    const [
      course,
      semester,
    ] = await Promise.all([
      ensureActiveCourse(
        input.courseId,
      ),

      ensureValidSemester(
        input.semesterId,
      ),
    ]);

    if (
      course.credits.toNumber() !==
      input.credits
    ) {
      throw new AppError(
        `Course offering credits must match the course credits (${course.credits.toString()})`,
        400,
      );
    }

    const existing =
      await prisma.courseOffering.findUnique(
        {
          where: {
            courseId_semesterId: {
              courseId:
                input.courseId,
              semesterId:
                input.semesterId,
            },
          },
        },
      );

    if (existing) {
      throw new AppError(
        "This course is already offered in the selected semester",
        409,
      );
    }

    const offering =
      await prisma.courseOffering.create({
        data: {
          courseId:
            input.courseId,

          semesterId:
            input.semesterId,

          code: input.code,

          title: input.title,

          credits:
            new Prisma.Decimal(
              input.credits,
            ),
        },

        include: {
          course: {
            select: courseSelect,
          },

          semester: {
            select: semesterSelect,
          },

          _count: {
            select: {
              sections: true,
            },
          },
        },
      });

    return offering;
  };

export const getCourseOfferings =
  async (
    query: CourseOfferingListQueryInput,
  ) => {
    const {
      page,
      limit,
      courseId,
      semesterId,
      isActive,
      search,
      sortBy,
      sortOrder,
    } = query;

    const skip =
      (page - 1) * limit;

    const where: Prisma.CourseOfferingWhereInput =
      {
        ...(courseId && {
          courseId,
        }),

        ...(semesterId && {
          semesterId,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),

        ...(search && {
          OR: [
            {
              code: {
                contains: search,
                mode: "insensitive",
              },
            },

            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      };

    const [
      items,
      total,
    ] = await prisma.$transaction([
      prisma.courseOffering.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          [sortBy]: sortOrder,
        },

        include: {
          course: {
            select: courseSelect,
          },

          semester: {
            select: semesterSelect,
          },

          _count: {
            select: {
              sections: true,
            },
          },
        },
      }),

      prisma.courseOffering.count({
        where,
      }),
    ]);

    return {
      items,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  };

export const getCourseOfferingById =
  async (id: string) => {
    const offering =
      await prisma.courseOffering.findUnique(
        {
          where: {
            id,
          },

          include: {
            course: {
              select: courseSelect,
            },

            semester: {
              select: semesterSelect,
            },

            sections: true,

            _count: {
              select: {
                sections: true,
              },
            },
          },
        },
      );

    if (!offering) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    return offering;
  };

export const updateCourseOffering =
  async (
    id: string,
    input: UpdateCourseOfferingInput,
  ) => {
    const existing =
      await prisma.courseOffering.findUnique(
        {
          where: {
            id,
          },

          include: {
            course: {
              select: courseSelect,
            },

            semester: {
              select: semesterSelect,
            },
          },
        },
      );

    if (!existing) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    if (
      existing.semester.status ===
      "COMPLETED"
    ) {
      throw new AppError(
        "Cannot update an offering from a completed semester",
        409,
      );
    }

    if (
      input.credits !== undefined &&
      input.credits !==
        existing.course.credits.toNumber()
    ) {
      throw new AppError(
        `Course offering credits must match the course credits (${existing.course.credits.toString()})`,
        400,
      );
    }

    const updated =
      await prisma.courseOffering.update({
        where: {
          id,
        },

        data: {
          ...(input.code !==
            undefined && {
            code: input.code,
          }),

          ...(input.title !==
            undefined && {
            title: input.title,
          }),

          ...(input.credits !==
            undefined && {
            credits:
              new Prisma.Decimal(
                input.credits,
              ),
          }),
        },

        include: {
          course: {
            select: courseSelect,
          },

          semester: {
            select: semesterSelect,
          },

          _count: {
            select: {
              sections: true,
            },
          },
        },
      });

    return updated;
  };

export const activateCourseOffering =
  async (id: string) => {
    const offering =
      await prisma.courseOffering.findUnique(
        {
          where: {
            id,
          },

          include: {
            semester: {
              select: semesterSelect,
            },
          },
        },
      );

    if (!offering) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    if (
      offering.semester.status ===
      "COMPLETED"
    ) {
      throw new AppError(
        "Cannot activate an offering from a completed semester",
        409,
      );
    }

    if (offering.isActive) {
      throw new AppError(
        "Course offering is already active",
        409,
      );
    }

    return prisma.courseOffering.update({
      where: {
        id,
      },

      data: {
        isActive: true,
      },

      include: {
        course: {
          select: courseSelect,
        },

        semester: {
          select: semesterSelect,
        },
      },
    });
  };

export const deactivateCourseOffering =
  async (id: string) => {
    const offering =
      await prisma.courseOffering.findUnique(
        {
          where: {
            id,
          },

          include: {
            semester: {
              select: semesterSelect,
            },

            _count: {
              select: {
                sections: true,
              },
            },
          },
        },
      );

    if (!offering) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    if (offering.isActive === false) {
      throw new AppError(
        "Course offering is already inactive",
        409,
      );
    }

    if (
      offering._count.sections > 0
    ) {
      throw new AppError(
        "Cannot deactivate an offering that has sections",
        409,
      );
    }

    return prisma.courseOffering.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },

      include: {
        course: {
          select: courseSelect,
        },

        semester: {
          select: semesterSelect,
        },
      },
    });
  };

export const deleteCourseOffering =
  async (id: string) => {
    const offering =
      await prisma.courseOffering.findUnique(
        {
          where: {
            id,
          },

          include: {
            _count: {
              select: {
                sections: true,
              },
            },
          },
        },
      );

    if (!offering) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    if (
      offering._count.sections > 0
    ) {
      throw new AppError(
        "Cannot delete an offering that has sections",
        409,
      );
    }

    await prisma.courseOffering.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });
  };