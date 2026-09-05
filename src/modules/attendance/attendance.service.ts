import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  AttendanceListQueryInput,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "./attendance.validation.js";

/*
|--------------------------------------------------------------------------
| Attendance select
|--------------------------------------------------------------------------
*/

const attendanceSelect = {
  id: true,
  enrollmentId: true,
  date: true,
  status: true,
  remarks: true,
  markedById: true,
  createdAt: true,
  updatedAt: true,

  enrollment: {
    select: {
      id: true,
      status: true,
      enrolledAt: true,

      student: {
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,

          program: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      },

      section: {
        select: {
          id: true,
          sectionCode: true,
          name: true,

          instructorId: true,

          courseOffering: {
            select: {
              id: true,
              code: true,
              title: true,
              credits: true,

              course: {
                select: {
                  id: true,
                  code: true,
                  title: true,
                },
              },

              semester: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.AttendanceSelect;

/*
|--------------------------------------------------------------------------
| Date helpers
|--------------------------------------------------------------------------
|
| Attendance represents a calendar day rather than a specific time.
|
| We normalize all attendance dates to UTC midnight so that:
|
| 2026-09-05T00:00:00Z
| 2026-09-05T10:30:00Z
|
| are treated as the same attendance date.
|
*/

const normalizeAttendanceDate = (
  date: Date,
): Date => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );
};

/*
|--------------------------------------------------------------------------
| Instructor
|--------------------------------------------------------------------------
*/

const getInstructorByUserId = async (
  userId: string,
) => {
  const instructor =
    await prisma.instructorProfile.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,
        userId: true,
        isActive: true,
      },
    });

  if (!instructor) {
    throw new AppError(
      "Instructor profile not found",
      404,
    );
  }

  if (!instructor.isActive) {
    throw new AppError(
      "Instructor account is inactive",
      403,
    );
  }

  return instructor;
};

/*
|--------------------------------------------------------------------------
| Validate enrollment for attendance
|--------------------------------------------------------------------------
*/

const getEnrollmentForAttendance = async (
  enrollmentId: string,
) => {
  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },

      select: {
        id: true,
        studentId: true,
        sectionId: true,
        status: true,

        section: {
          select: {
            id: true,
            isActive: true,
            instructorId: true,

            courseOffering: {
              select: {
                id: true,
                isActive: true,

                course: {
                  select: {
                    id: true,
                    isActive: true,
                    deletedAt: true,
                  },
                },

                semester: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!enrollment) {
    throw new AppError(
      "Enrollment not found",
      404,
    );
  }

  if (
    enrollment.status !== "ENROLLED"
  ) {
    throw new AppError(
      "Attendance can only be marked for an enrolled student",
      400,
    );
  }

  if (!enrollment.section.isActive) {
    throw new AppError(
      "Section is inactive",
      400,
    );
  }

  if (
    !enrollment.section
      .courseOffering.isActive
  ) {
    throw new AppError(
      "Course offering is inactive",
      400,
    );
  }

  if (
    !enrollment.section
      .courseOffering.course.isActive ||
    enrollment.section
      .courseOffering.course.deletedAt
  ) {
    throw new AppError(
      "Course is inactive",
      400,
    );
  }

  if (
    enrollment.section
      .courseOffering.semester.status ===
    "PLANNED"
  ) {
    throw new AppError(
      "Attendance cannot be marked before the semester starts",
      400,
    );
  }

  if (
    enrollment.section
      .courseOffering.semester.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Attendance cannot be marked after the semester is completed",
      400,
    );
  }

  return enrollment;
};

/*
|--------------------------------------------------------------------------
| Instructor ownership
|--------------------------------------------------------------------------
*/

const validateInstructorOwnership = (
  instructorId: string,
  sectionInstructorId: string,
) => {
  if (
    instructorId !== sectionInstructorId
  ) {
    throw new AppError(
      "You can only manage attendance for your own sections",
      403,
    );
  }
};

/*
|--------------------------------------------------------------------------
| Prevent future attendance
|--------------------------------------------------------------------------
*/

const validateAttendanceDate = (
  date: Date,
) => {
  const normalizedDate =
    normalizeAttendanceDate(date);

  const today =
    normalizeAttendanceDate(
      new Date(),
    );

  if (normalizedDate > today) {
    throw new AppError(
      "Attendance cannot be marked for a future date",
      400,
    );
  }

  return normalizedDate;
};

/*
|--------------------------------------------------------------------------
| Create attendance
|--------------------------------------------------------------------------
*/

export const createAttendance = async (
  userId: string,
  input: CreateAttendanceInput,
) => {
  const instructor =
    await getInstructorByUserId(userId);

  const enrollment =
    await getEnrollmentForAttendance(
      input.enrollmentId,
    );

  validateInstructorOwnership(
    instructor.id,
    enrollment.section.instructorId,
  );

  const attendanceDate =
    validateAttendanceDate(input.date);

  /*
   * Prevent duplicate attendance for the
   * same enrollment and calendar date.
   */
  const existingAttendance =
    await prisma.attendance.findUnique({
      where: {
        enrollmentId_date: {
          enrollmentId:
            enrollment.id,
          date: attendanceDate,
        },
      },

      select: {
        id: true,
        status: true,
        date: true,
      },
    });

  if (existingAttendance) {
    throw new AppError(
      "Attendance has already been marked for this student on this date",
      409,
    );
  }

  try {
    return await prisma.attendance.create({
      data: {
        enrollmentId:
          enrollment.id,
        date: attendanceDate,
        status: input.status,

        ...(input.remarks !== undefined
          ? {
              remarks: input.remarks,
            }
          : {}),

        markedById: instructor.userId,
      },

      select: attendanceSelect,
    });
  } catch (error) {
    /*
     * The database unique constraint remains
     * the final protection against concurrent
     * duplicate attendance requests.
     */
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Attendance has already been marked for this student on this date",
        409,
      );
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Update attendance
|--------------------------------------------------------------------------
*/

export const updateAttendance = async (
  userId: string,
  id: string,
  input: UpdateAttendanceInput,
) => {
  const instructor =
    await getInstructorByUserId(userId);

  const attendance =
    await prisma.attendance.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        enrollmentId: true,

        enrollment: {
          select: {
            section: {
              select: {
                instructorId: true,
                courseOffering: {
                  select: {
                    semester: {
                      select: {
                        status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!attendance) {
    throw new AppError(
      "Attendance record not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    attendance.enrollment.section
      .instructorId,
  );

  if (
    attendance.enrollment.section
      .courseOffering.semester.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Attendance cannot be modified after the semester is completed",
      400,
    );
  }

  const updated =
    await prisma.attendance.update({
      where: {
        id,
      },

      data: {
        ...(input.status !== undefined
          ? {
              status: input.status,
            }
          : {}),

        ...(input.remarks !== undefined
          ? {
              remarks: input.remarks,
            }
          : {}),
      },

      select: attendanceSelect,
    });

  return updated;
};

/*
|--------------------------------------------------------------------------
| Delete attendance
|--------------------------------------------------------------------------
*/

export const deleteAttendance = async (
  userId: string,
  id: string,
) => {
  const instructor =
    await getInstructorByUserId(userId);

  const attendance =
    await prisma.attendance.findUnique({
      where: {
        id,
      },

      select: {
        id: true,

        enrollment: {
          select: {
            section: {
              select: {
                instructorId: true,

                courseOffering: {
                  select: {
                    semester: {
                      select: {
                        status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!attendance) {
    throw new AppError(
      "Attendance record not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    attendance.enrollment.section
      .instructorId,
  );

  if (
    attendance.enrollment.section
      .courseOffering.semester.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Attendance cannot be deleted after the semester is completed",
      400,
    );
  }

  await prisma.attendance.delete({
    where: {
      id,
    },
  });

  return {
    id,
  };
};

/*
|--------------------------------------------------------------------------
| Get attendance by ID
|--------------------------------------------------------------------------
*/

export const getAttendanceById =
  async (
    id: string,
  ) => {
    const attendance =
      await prisma.attendance.findUnique({
        where: {
          id,
        },

        select: attendanceSelect,
      });

    if (!attendance) {
      throw new AppError(
        "Attendance record not found",
        404,
      );
    }

    return attendance;
  };

/*
|--------------------------------------------------------------------------
| Get attendance list
|--------------------------------------------------------------------------
*/

export const getAttendances = async (
  query: AttendanceListQueryInput,
) => {
  const {
    page,
    limit,
    enrollmentId,
    studentId,
    sectionId,
    markedById,
    status,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = query;

  const normalizedDateFrom =
    dateFrom
      ? normalizeAttendanceDate(
          dateFrom,
        )
      : undefined;

  const normalizedDateTo =
    dateTo
      ? normalizeAttendanceDate(
          dateTo,
        )
      : undefined;

  const where: Prisma.AttendanceWhereInput =
    {
      ...(enrollmentId
        ? {
            enrollmentId,
          }
        : {}),

      ...(markedById
        ? {
            markedById,
          }
        : {}),

      ...(status
        ? {
            status,
          }
        : {}),

      ...(studentId
        ? {
            enrollment: {
              studentId,
            },
          }
        : {}),

      ...(sectionId
        ? {
            enrollment: {
              sectionId,
            },
          }
        : {}),

      ...((normalizedDateFrom ||
        normalizedDateTo)
        ? {
            date: {
              ...(normalizedDateFrom
                ? {
                    gte: normalizedDateFrom,
                  }
                : {}),

              ...(normalizedDateTo
                ? {
                    lte: normalizedDateTo,
                  }
                : {}),
            },
          }
        : {}),
    };

  const skip =
    (page - 1) * limit;

  const orderBy: Prisma.AttendanceOrderByWithRelationInput =
    {
      [sortBy]: sortOrder,
    };

  const [
    items,
    total,
  ] = await prisma.$transaction([
    prisma.attendance.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: attendanceSelect,
    }),

    prisma.attendance.count({
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

/*
|--------------------------------------------------------------------------
| Get current student's attendance
|--------------------------------------------------------------------------
*/

export const getMyAttendance = async (
  userId: string,
  query: AttendanceListQueryInput,
) => {
  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,
      },
    });

  if (!student) {
    throw new AppError(
      "Student profile not found",
      404,
    );
  }

  return getAttendances({
    ...query,
    studentId: student.id,
  });
};

/*
|--------------------------------------------------------------------------
| Attendance summary
|--------------------------------------------------------------------------
*/

export const getAttendanceSummary =
  async (
    enrollmentId: string,
  ) => {
    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },

        select: {
          id: true,
          status: true,

          student: {
            select: {
              id: true,
              studentId: true,
              firstName: true,
              lastName: true,
            },
          },

          section: {
            select: {
              id: true,
              sectionCode: true,
              name: true,

              courseOffering: {
                select: {
                  code: true,
                  title: true,
                  course: {
                    select: {
                      code: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!enrollment) {
      throw new AppError(
        "Enrollment not found",
        404,
      );
    }

    const grouped =
      await prisma.attendance.groupBy({
        by: ["status"],

        where: {
          enrollmentId,
        },

        _count: {
          _all: true,
        },
      });

    const totalClasses =
      grouped.reduce(
        (total, item) =>
          total + item._count._all,
        0,
      );

    const present =
      grouped.find(
        (item) =>
          item.status === "PRESENT",
      )?._count._all ?? 0;

    const late =
      grouped.find(
        (item) =>
          item.status === "LATE",
      )?._count._all ?? 0;

    const absent =
      grouped.find(
        (item) =>
          item.status === "ABSENT",
      )?._count._all ?? 0;

    const excused =
      grouped.find(
        (item) =>
          item.status === "EXCUSED",
      )?._count._all ?? 0;

    /*
     * Attendance percentage counts PRESENT
     * and LATE as attended classes.
     *
     * EXCUSED is excluded from the denominator.
     */
    const countedClasses =
      totalClasses - excused;

    const attendedClasses =
      present + late;

    const attendancePercentage =
      countedClasses > 0
        ? Number(
            (
              (attendedClasses /
                countedClasses) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
      },

      student: enrollment.student,

      section: {
        id: enrollment.section.id,
        sectionCode:
          enrollment.section
            .sectionCode,
        name: enrollment.section.name,
      },

      course: {
        code: enrollment.section
          .courseOffering.course.code,

        title:
          enrollment.section
            .courseOffering.course.title,

        offeringCode:
          enrollment.section
            .courseOffering.code,

        offeringTitle:
          enrollment.section
            .courseOffering.title,
      },

      summary: {
        totalClasses,
        present,
        late,
        absent,
        excused,
        countedClasses,
        attendedClasses,
        attendancePercentage,
      },
    };
  };