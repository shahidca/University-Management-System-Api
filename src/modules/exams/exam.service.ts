import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateExamInput,
  ExamListQueryInput,
  UpdateExamInput,
} from "./exam.validation.js";

const examSelect = {
  id: true,
  sectionId: true,
  title: true,
  description: true,
  examType: true,
  totalMarks: true,
  examDate: true,
  startTime: true,
  endTime: true,
  room: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,

  section: {
    select: {
      id: true,
      sectionCode: true,
      name: true,
      capacity: true,
      enrolledCount: true,
      isActive: true,

      instructor: {
        select: {
          id: true,
          userId: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          designation: true,
          isActive: true,
        },
      },

      courseOffering: {
        select: {
          id: true,
          code: true,
          title: true,
          credits: true,
          isActive: true,

          course: {
            select: {
              id: true,
              code: true,
              title: true,
              credits: true,
              courseType: true,
              level: true,
              isActive: true,
              deletedAt: true,
            },
          },

          semester: {
            select: {
              id: true,
              name: true,
              code: true,
              type: true,
              status: true,
              startDate: true,
              endDate: true,
              registrationOpen: true,
              registrationClose: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ExamSelect;

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
        employeeId: true,
        firstName: true,
        lastName: true,
        designation: true,
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

const getSectionForExam = async (
  sectionId: string,
) => {
  const section =
    await prisma.section.findUnique({
      where: {
        id: sectionId,
      },
      select: {
        id: true,
        sectionCode: true,
        name: true,
        capacity: true,
        enrolledCount: true,
        isActive: true,
        instructorId: true,

        instructor: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },

        courseOffering: {
          select: {
            id: true,
            code: true,
            title: true,
            credits: true,
            isActive: true,

            course: {
              select: {
                id: true,
                code: true,
                title: true,
                credits: true,
                courseType: true,
                level: true,
                isActive: true,
                deletedAt: true,
              },
            },

            semester: {
              select: {
                id: true,
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
      },
    });

  if (!section) {
    throw new AppError(
      "Section not found",
      404,
    );
  }

  if (!section.isActive) {
    throw new AppError(
      "Section is inactive",
      400,
    );
  }

  if (!section.courseOffering.isActive) {
    throw new AppError(
      "Course offering is inactive",
      400,
    );
  }

  if (
    !section.courseOffering.course.isActive ||
    section.courseOffering.course.deletedAt
  ) {
    throw new AppError(
      "Course is inactive or deleted",
      400,
    );
  }

  if (
    section.courseOffering.semester.status ===
    "COMPLETED"
  ) {
    throw new AppError(
      "Cannot manage exams for a completed semester",
      400,
    );
  }

  return section;
};

const validateInstructorOwnership = (
  instructorId: string,
  sectionInstructorId: string,
): void => {
  if (
    instructorId !== sectionInstructorId
  ) {
    throw new AppError(
      "You are not assigned to this section",
      403,
    );
  }
};

const validateExamDate = (
  examDate: Date,
  semesterStartDate: Date,
  semesterEndDate: Date,
): void => {
  if (examDate < semesterStartDate) {
    throw new AppError(
      "Exam date cannot be before the semester start date",
      400,
    );
  }

  if (examDate > semesterEndDate) {
    throw new AppError(
      "Exam date cannot be after the semester end date",
      400,
    );
  }
};

const validateExamTime = (
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): void => {
  if (
    startTime &&
    endTime &&
    startTime >= endTime
  ) {
    throw new AppError(
      "Exam start time must be before end time",
      400,
    );
  }
};

const validateExamConflict = async ({
  sectionId,
  examDate,
  startTime,
  endTime,
  excludeExamId,
}: {
  sectionId: string;
  examDate: Date;
  startTime?: string | null | undefined; 
  endTime?: string | null | undefined;   
  excludeExamId?: string;
}): Promise<void> => {
  const dayStart = new Date(examDate);
  dayStart.setUTCHours(
    0,
    0,
    0,
    0,
  );

  const dayEnd = new Date(examDate);
  dayEnd.setUTCHours(
    23,
    59,
    59,
    999,
  );

  const existingExams =
    await prisma.exam.findMany({
      where: {
        sectionId,
        examDate: {
          gte: dayStart,
          lte: dayEnd,
        },
        ...(excludeExamId
          ? {
              id: {
                not: excludeExamId,
              },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        examDate: true,
        startTime: true,
        endTime: true,
      },
    });

  // If either exam has no scheduled time,
  // treat the same-day exam as a conflict.
  if (!startTime || !endTime) {
    if (existingExams.length > 0) {
      throw new AppError(
        "Another exam already exists for this section on the selected date",
        409,
      );
    }

    return;
  }

  for (const existingExam of existingExams) {
    if (
      !existingExam.startTime ||
      !existingExam.endTime
    ) {
      throw new AppError(
        "Another untimed exam already exists for this section on the selected date",
        409,
      );
    }

    const overlaps =
      startTime <
        existingExam.endTime &&
      endTime >
        existingExam.startTime;

    if (overlaps) {
      throw new AppError(
        `Exam time conflicts with "${existingExam.title}"`,
        409,
      );
    }
  }
};

export const createExam = async (
  userId: string,
  input: CreateExamInput,
) => {
  const instructor =
    await getInstructorByUserId(
      userId,
    );

  const section =
    await getSectionForExam(
      input.sectionId,
    );

  validateInstructorOwnership(
    instructor.id,
    section.instructorId,
  );

  validateExamDate(
    input.examDate,
    section.courseOffering.semester
      .startDate,
    section.courseOffering.semester
      .endDate,
  );

  validateExamTime(
    input.startTime,
    input.endTime,
  );

  await validateExamConflict({
    sectionId: input.sectionId,
    examDate: input.examDate,
    startTime: input.startTime,
    endTime: input.endTime,
  });

  try {
    return await prisma.exam.create({
      data: {
        sectionId: input.sectionId,
        title: input.title,
        examType: input.examType,
        totalMarks: new Prisma.Decimal(
          input.totalMarks,
        ),
        examDate: input.examDate,

        ...(input.description !==
        undefined
          ? {
              description:
                input.description,
            }
          : {}),

        ...(input.startTime !==
        undefined
          ? {
              startTime:
                input.startTime,
            }
          : {}),

        ...(input.endTime !==
        undefined
          ? {
              endTime:
                input.endTime,
            }
          : {}),

        ...(input.room !== undefined
          ? {
              room: input.room,
            }
          : {}),
      },
      select: examSelect,
    });
  } catch (error) {
    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      throw new AppError(
        "Failed to create exam",
        400,
      );
    }

    throw error;
  }
};

export const getExamById = async (
  examId: string,
) => {
  const exam =
    await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: examSelect,
    });

  if (!exam) {
    throw new AppError(
      "Exam not found",
      404,
    );
  }

  return exam;
};

export const getExams = async (
  query: ExamListQueryInput,
) => {
  const {
    page,
    limit,
    sectionId,
    examType,
    isPublished,
    dateFrom,
    dateTo,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip =
    (page - 1) * limit;

  const where: Prisma.ExamWhereInput = {
    ...(sectionId
      ? {
          sectionId,
        }
      : {}),

    ...(examType
      ? {
          examType,
        }
      : {}),

    ...(isPublished !== undefined
      ? {
          isPublished,
        }
      : {}),

    ...(dateFrom || dateTo
      ? {
          examDate: {
            ...(dateFrom
              ? {
                  gte: dateFrom,
                }
              : {}),

            ...(dateTo
              ? {
                  lte: dateTo,
                }
              : {}),
          },
        }
      : {}),

    ...(search
      ? {
          OR: [
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
        }
      : {}),
  };

  const [exams, total] =
    await prisma.$transaction([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: examSelect,
      }),

      prisma.exam.count({
        where,
      }),
    ]);

  return {
    items: exams,
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

export const updateExam = async (
  userId: string,
  examId: string,
  input: UpdateExamInput,
) => {
  const instructor =
    await getInstructorByUserId(
      userId,
    );

  const existingExam =
    await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        id: true,
        sectionId: true,
        title: true,
        description: true,
        examType: true,
        totalMarks: true,
        examDate: true,
        startTime: true,
        endTime: true,
        room: true,
        isPublished: true,

        section: {
          select: {
            instructorId: true,

            courseOffering: {
              select: {
                isActive: true,

                course: {
                  select: {
                    isActive: true,
                    deletedAt: true,
                  },
                },

                semester: {
                  select: {
                    status: true,
                    startDate: true,
                    endDate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!existingExam) {
    throw new AppError(
      "Exam not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    existingExam.section
      .instructorId,
  );

  if (
    !existingExam.section.courseOffering
      .isActive
  ) {
    throw new AppError(
      "Course offering is inactive",
      400,
    );
  }

  if (
    !existingExam.section.courseOffering
      .course.isActive ||
    existingExam.section.courseOffering
      .course.deletedAt
  ) {
    throw new AppError(
      "Course is inactive or deleted",
      400,
    );
  }

  if (
    existingExam.section
      .courseOffering.semester
      .status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot update an exam from a completed semester",
      400,
    );
  }

  if (existingExam.isPublished) {
    throw new AppError(
      "Published exams cannot be edited",
      400,
    );
  }

  const examDate =
    input.examDate ??
    existingExam.examDate;

  const startTime =
    input.startTime !== undefined
      ? input.startTime
      : existingExam.startTime;

  const endTime =
    input.endTime !== undefined
      ? input.endTime
      : existingExam.endTime;

  validateExamDate(
    examDate,
    existingExam.section
      .courseOffering.semester
      .startDate,
    existingExam.section
      .courseOffering.semester
      .endDate,
  );

  validateExamTime(
    startTime,
    endTime,
  );

  if (
    input.examDate !== undefined ||
    input.startTime !== undefined ||
    input.endTime !== undefined
  ) {
    await validateExamConflict({
      sectionId:
        existingExam.sectionId,
      examDate,
      startTime,
      endTime,
      excludeExamId: examId,
    });
  }

  const data: Prisma.ExamUpdateInput =
    {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

  if (
    input.description !==
    undefined
  ) {
    data.description =
      input.description;
  }

  if (input.examType !== undefined) {
    data.examType =
      input.examType;
  }

  if (
    input.totalMarks !==
    undefined
  ) {
    data.totalMarks =
      new Prisma.Decimal(
        input.totalMarks,
      );
  }

  if (input.examDate !== undefined) {
    data.examDate =
      input.examDate;
  }

  if (input.startTime !== undefined) {
    data.startTime =
      input.startTime;
  }

  if (input.endTime !== undefined) {
    data.endTime =
      input.endTime;
  }

  if (input.room !== undefined) {
    data.room = input.room;
  }

  return prisma.exam.update({
    where: {
      id: examId,
    },
    data,
    select: examSelect,
  });
};

export const publishExam = async (
  userId: string,
  examId: string,
) => {
  const instructor =
    await getInstructorByUserId(
      userId,
    );

  const exam =
    await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        id: true,
        isPublished: true,

        section: {
          select: {
            instructorId: true,
            isActive: true,

            courseOffering: {
              select: {
                isActive: true,

                course: {
                  select: {
                    isActive: true,
                    deletedAt: true,
                  },
                },

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
    });

  if (!exam) {
    throw new AppError(
      "Exam not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    exam.section
      .instructorId,
  );

  if (exam.isPublished) {
    throw new AppError(
      "Exam is already published",
      400,
    );
  }

  if (!exam.section.isActive) {
    throw new AppError(
      "Section is inactive",
      400,
    );
  }

  if (
    !exam.section.courseOffering
      .isActive
  ) {
    throw new AppError(
      "Course offering is inactive",
      400,
    );
  }

  if (
    !exam.section.courseOffering
      .course.isActive ||
    exam.section.courseOffering
      .course.deletedAt
  ) {
    throw new AppError(
      "Course is inactive or deleted",
      400,
    );
  }

  if (
    exam.section.courseOffering
      .semester.status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot publish an exam from a completed semester",
      400,
    );
  }

  return prisma.exam.update({
    where: {
      id: examId,
    },
    data: {
      isPublished: true,
    },
    select: examSelect,
  });
};

export const unpublishExam = async (
  userId: string,
  examId: string,
) => {
  const instructor =
    await getInstructorByUserId(
      userId,
    );

  const exam =
    await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        id: true,
        isPublished: true,

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
    });

  if (!exam) {
    throw new AppError(
      "Exam not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    exam.section
      .instructorId,
  );

  if (!exam.isPublished) {
    throw new AppError(
      "Exam is not published",
      400,
    );
  }

  if (
    exam.section.courseOffering
      .semester.status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot unpublish an exam from a completed semester",
      400,
    );
  }

  return prisma.exam.update({
    where: {
      id: examId,
    },
    data: {
      isPublished: false,
    },
    select: examSelect,
  });
};

export const deleteExam = async (
  userId: string,
  examId: string,
) => {
  const instructor =
    await getInstructorByUserId(
      userId,
    );

  const exam =
    await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        id: true,
        isPublished: true,

        _count: {
          select: {
            results: true,
          },
        },

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
    });

  if (!exam) {
    throw new AppError(
      "Exam not found",
      404,
    );
  }

  validateInstructorOwnership(
    instructor.id,
    exam.section
      .instructorId,
  );

  if (exam.isPublished) {
    throw new AppError(
      "Published exams cannot be deleted",
      400,
    );
  }

  if (
    exam._count.results > 0
  ) {
    throw new AppError(
      "Cannot delete an exam that already has results",
      409,
    );
  }

  if (
    exam.section.courseOffering
      .semester.status === "COMPLETED"
  ) {
    throw new AppError(
      "Cannot delete an exam from a completed semester",
      400,
    );
  }

  await prisma.exam.delete({
    where: {
      id: examId,
    },
  });

  return {
    id: examId,
  };
};