import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CourseListQueryInput,
  CreateCourseInput,
  UpdateCourseInput,
} from "./course.validation.js";

export const createCourse = async (
  input: CreateCourseInput,
) => {
  const department =
    await prisma.department.findFirst({
      where: {
        id: input.departmentId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

  if (!department) {
    throw new AppError(
      "Department not found",
      404,
    );
  }

  const existingCourse =
    await prisma.course.findUnique({
      where: {
        code: input.code,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

  if (existingCourse) {
    throw new AppError(
      existingCourse.deletedAt
        ? "Course code belongs to a deleted course"
        : "Course code already exists",
      409,
    );
  }

  const course =
    await prisma.course.create({
      data: {
        departmentId:
          input.departmentId,

        code: input.code,

        title: input.title,

        description:
          input.description ?? null,

        credits:
          new Prisma.Decimal(
            input.credits,
          ),

        courseType:
          input.courseType,

        level: input.level,
      },

      include: {
        department: true,
      },
    });

  return course;
};

export const getCourses = async (
  query: CourseListQueryInput,
) => {
  const {
    page,
    limit,
    departmentId,
    courseType,
    level,
    isActive,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput =
    {
      deletedAt: null,

      ...(departmentId && {
        departmentId,
      }),

      ...(courseType && {
        courseType,
      }),

      ...(level !== undefined && {
        level,
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
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

  const [
    courses,
    total,
  ] = await prisma.$transaction([
    prisma.course.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        department: true,

        _count: {
          select: {
            offerings: true,
            prerequisites: true,
            prerequisiteFor: true,
          },
        },
      },
    }),

    prisma.course.count({
      where,
    }),
  ]);

  return {
    items: courses,

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

export const getCourseById = async (
  id: string,
) => {
  const course =
    await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include: {
        department: true,

        prerequisites: {
          include: {
            prerequisite: true,
          },
        },

        prerequisiteFor: {
          include: {
            course: true,
          },
        },

        _count: {
          select: {
            offerings: true,
          },
        },
      },
    });

  if (!course) {
    throw new AppError(
      "Course not found",
      404,
    );
  }

  return course;
};

export const updateCourse = async (
  id: string,
  input: UpdateCourseInput,
) => {
  const existingCourse =
    await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

  if (!existingCourse) {
    throw new AppError(
      "Course not found",
      404,
    );
  }

  if (
    input.code !== undefined &&
    input.code !== existingCourse.code
  ) {
    const duplicate =
      await prisma.course.findUnique({
        where: {
          code: input.code,
        },

        select: {
          id: true,
        },
      });

    if (duplicate) {
      throw new AppError(
        "Course code already exists",
        409,
      );
    }
  }

  const updatedCourse =
    await prisma.course.update({
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

        ...(input.description !==
          undefined && {
          description:
            input.description,
        }),

        ...(input.credits !==
          undefined && {
          credits:
            new Prisma.Decimal(
              input.credits,
            ),
        }),

        ...(input.courseType !==
          undefined && {
          courseType:
            input.courseType,
        }),

        ...(input.level !==
          undefined && {
          level: input.level,
        }),
      },

      include: {
        department: true,
      },
    });

  return updatedCourse;
};

export const activateCourse = async (
  id: string,
) => {
  const course =
    await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

  if (!course) {
    throw new AppError(
      "Course not found",
      404,
    );
  }

  if (course.isActive) {
    throw new AppError(
      "Course is already active",
      409,
    );
  }

  return prisma.course.update({
    where: {
      id,
    },

    data: {
      isActive: true,
    },

    include: {
      department: true,
    },
  });
};

export const deactivateCourse =
  async (id: string) => {
    const course =
      await prisma.course.findFirst({
        where: {
          id,
          deletedAt: null,
        },

        include: {
          _count: {
            select: {
              offerings: true,
            },
          },
        },
      });

    if (!course) {
      throw new AppError(
        "Course not found",
        404,
      );
    }

    if (!course.isActive) {
      throw new AppError(
        "Course is already inactive",
        409,
      );
    }

    return prisma.course.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },

      include: {
        department: true,
      },
    });
  };

export const deleteCourse = async (
  id: string,
) => {
  const course =
    await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include: {
        _count: {
          select: {
            offerings: true,
          },
        },
      },
    });

  if (!course) {
    throw new AppError(
      "Course not found",
      404,
    );
  }

  if (course._count.offerings > 0) {
    throw new AppError(
      "Cannot delete a course that has course offerings",
      409,
    );
  }

  await prisma.course.update({
    where: {
      id,
    },

    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};