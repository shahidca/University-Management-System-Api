import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateSectionInput,
  SectionListQueryInput,
  UpdateSectionInput,
} from "./section.validation.js";

const courseOfferingSelect = {
  id: true,
  courseId: true,
  semesterId: true,
  code: true,
  title: true,
  credits: true,
  isActive: true,
} satisfies Prisma.CourseOfferingSelect;

const instructorSelect = {
  id: true,
  userId: true,
  employeeId: true,
  firstName: true,
  lastName: true,
  designation: true,
  isActive: true,
} satisfies Prisma.InstructorProfileSelect;

const ensureActiveCourseOffering =
  async (
    courseOfferingId: string,
  ) => {
    const offering =
      await prisma.courseOffering.findUnique({
        where: {
          id: courseOfferingId,
        },

        include: {
          semester: {
            select: {
              id: true,
              academicYearId: true,
              name: true,
              code: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },

          course: {
            select: {
              id: true,
              code: true,
              title: true,
              isActive: true,
              deletedAt: true,
            },
          },
        },
      });

    if (!offering) {
      throw new AppError(
        "Course offering not found",
        404,
      );
    }

    if (!offering.isActive) {
      throw new AppError(
        "Course offering is inactive",
        409,
      );
    }

    if (
      !offering.course.isActive ||
      offering.course.deletedAt !== null
    ) {
      throw new AppError(
        "The course associated with this offering is inactive or deleted",
        409,
      );
    }

    if (
      offering.semester.status ===
      "COMPLETED"
    ) {
      throw new AppError(
        "Cannot create or modify a section for a completed semester",
        409,
      );
    }

    return offering;
  };

const ensureActiveInstructor =
  async (
    instructorId: string,
  ) => {
    const instructor =
      await prisma.instructorProfile.findUnique(
        {
          where: {
            id: instructorId,
          },

          select: instructorSelect,
        },
      );

    if (!instructor) {
      throw new AppError(
        "Instructor not found",
        404,
      );
    }

    if (!instructor.isActive) {
      throw new AppError(
        "Instructor is inactive",
        409,
      );
    }

    return instructor;
  };

export const createSection = async (
  input: CreateSectionInput,
) => {
  const [
    offering,
    instructor,
  ] = await Promise.all([
    ensureActiveCourseOffering(
      input.courseOfferingId,
    ),

    ensureActiveInstructor(
      input.instructorId,
    ),
  ]);

  const existing =
    await prisma.section.findUnique({
      where: {
        courseOfferingId_sectionCode: {
          courseOfferingId:
            input.courseOfferingId,
          sectionCode:
            input.sectionCode,
        },
      },
    });

  if (existing) {
    throw new AppError(
      "This section code already exists for the selected course offering",
      409,
    );
  }

  const section =
    await prisma.section.create({
      data: {
        courseOfferingId:
          input.courseOfferingId,

        instructorId:
          input.instructorId,

        sectionCode:
          input.sectionCode,

        name: input.name,

        capacity: input.capacity,

        enrolledCount: 0,
      },

      include: {
        courseOffering: {
          select: courseOfferingSelect,
        },

        instructor: {
          select: instructorSelect,
        },

        _count: {
          select: {
            enrollments: true,
            exams: true,
            schedules: true,
          },
        },
      },
    });

  return {
    ...section,
    semester: offering.semester,
    instructor,
  };
};

export const getSections = async (
  query: SectionListQueryInput,
) => {
  const {
    page,
    limit,
    courseOfferingId,
    instructorId,
    isActive,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip =
    (page - 1) * limit;

  const where: Prisma.SectionWhereInput =
    {
      ...(courseOfferingId && {
        courseOfferingId,
      }),

      ...(instructorId && {
        instructorId,
      }),

      ...(isActive !== undefined && {
        isActive,
      }),

      ...(search && {
        OR: [
          {
            sectionCode: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            name: {
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
    prisma.section.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        courseOffering: {
          select: courseOfferingSelect,
        },

        instructor: {
          select: instructorSelect,
        },

        _count: {
          select: {
            enrollments: true,
            exams: true,
            schedules: true,
          },
        },
      },
    }),

    prisma.section.count({
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

export const getSectionById = async (
  id: string,
) => {
  const section =
    await prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        courseOffering: {
          include: {
            course: {
              select: {
                id: true,
                code: true,
                title: true,
                credits: true,
                courseType: true,
                level: true,
              },
            },

            semester: {
              select: {
                id: true,
                academicYearId: true,
                name: true,
                code: true,
                type: true,
                status: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },

        instructor: {
          select: instructorSelect,
        },

        _count: {
          select: {
            enrollments: true,
            exams: true,
            schedules: true,
          },
        },
      },
    });

  if (!section) {
    throw new AppError(
      "Section not found",
      404,
    );
  }

  return section;
};

export const updateSection = async (
  id: string,
  input: UpdateSectionInput,
) => {
  const existing =
    await prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        courseOffering: {
          include: {
            semester: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

  if (!existing) {
    throw new AppError(
      "Section not found",
      404,
    );
  }

  if (
    existing.courseOffering.semester
      .status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot update a section from a completed semester",
      409,
    );
  }

  if (
    input.instructorId !== undefined
  ) {
    await ensureActiveInstructor(
      input.instructorId,
    );
  }

  if (
    input.sectionCode !== undefined &&
    input.sectionCode !==
      existing.sectionCode
  ) {
    const duplicate =
      await prisma.section.findUnique({
        where: {
          courseOfferingId_sectionCode: {
            courseOfferingId:
              existing.courseOfferingId,
            sectionCode:
              input.sectionCode,
          },
        },

        select: {
          id: true,
        },
      });

    if (duplicate) {
      throw new AppError(
        "This section code already exists for the selected course offering",
        409,
      );
    }
  }

  if (
    input.capacity !== undefined &&
    input.capacity <
      existing.enrolledCount
  ) {
    throw new AppError(
      `Capacity cannot be less than the current enrolled count (${existing.enrolledCount})`,
      400,
    );
  }

  const updated =
    await prisma.section.update({
      where: {
        id,
      },

      data: {
        ...(input.instructorId !==
          undefined && {
          instructorId:
            input.instructorId,
        }),

        ...(input.sectionCode !==
          undefined && {
          sectionCode:
            input.sectionCode,
        }),

        ...(input.name !==
          undefined && {
          name: input.name,
        }),

        ...(input.capacity !==
          undefined && {
          capacity:
            input.capacity,
        }),
      },

      include: {
        courseOffering: {
          select: courseOfferingSelect,
        },

        instructor: {
          select: instructorSelect,
        },

        _count: {
          select: {
            enrollments: true,
            exams: true,
            schedules: true,
          },
        },
      },
    });

  return updated;
};

export const activateSection = async (
  id: string,
) => {
  const section =
    await prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        courseOffering: {
          include: {
            semester: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

  if (!section) {
    throw new AppError(
      "Section not found",
      404,
    );
  }

  if (
    section.courseOffering.semester
      .status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot activate a section from a completed semester",
      409,
    );
  }

  if (section.isActive) {
    throw new AppError(
      "Section is already active",
      409,
    );
  }

  return prisma.section.update({
    where: {
      id,
    },

    data: {
      isActive: true,
    },

    include: {
      courseOffering: {
        select: courseOfferingSelect,
      },

      instructor: {
        select: instructorSelect,
      },
    },
  });
};

export const deactivateSection =
  async (id: string) => {
    const section =
      await prisma.section.findUnique({
        where: {
          id,
        },

        include: {
          courseOffering: {
            include: {
              semester: {
                select: {
                  status: true,
                },
              },
            },
          },

          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      });

    if (!section) {
      throw new AppError(
        "Section not found",
        404,
      );
    }

    if (
      section.courseOffering.semester
        .status === "COMPLETED"
    ) {
      throw new AppError(
        "Section belongs to a completed semester",
        409,
      );
    }

    if (!section.isActive) {
      throw new AppError(
        "Section is already inactive",
        409,
      );
    }

    if (
      section._count.enrollments > 0
    ) {
      throw new AppError(
        "Cannot deactivate a section that has enrollments",
        409,
      );
    }

    return prisma.section.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },

      include: {
        courseOffering: {
          select: courseOfferingSelect,
        },

        instructor: {
          select: instructorSelect,
        },
      },
    });
  };

export const deleteSection = async (
  id: string,
) => {
  const section =
    await prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            enrollments: true,
            exams: true,
            schedules: true,
          },
        },
      },
    });

  if (!section) {
    throw new AppError(
      "Section not found",
      404,
    );
  }

  if (
    section._count.enrollments > 0 ||
    section._count.exams > 0 ||
    section._count.schedules > 0
  ) {
    throw new AppError(
      "Cannot delete a section that contains academic records",
      409,
    );
  }

  await prisma.section.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },
  });
};