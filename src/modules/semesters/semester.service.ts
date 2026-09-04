import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
  CreateSemesterInput,
  SemesterListQueryInput,
  UpdateSemesterInput,
} from "./semester.validation.js";

const validateSemesterDates = (
  startDate: Date,
  endDate: Date,
  registrationOpen: Date,
  registrationClose: Date,
): void => {
  if (startDate >= endDate) {
    throw new AppError(
      "Semester start date must be before end date",
      400,
    );
  }

  if (
    registrationOpen >=
    registrationClose
  ) {
    throw new AppError(
      "Registration open date must be before registration close date",
      400,
    );
  }

  if (registrationClose > startDate) {
    throw new AppError(
      "Registration must close on or before the semester start date",
      400,
    );
  }
};

const validateAcademicYearBoundary =
  (
    academicYear: {
      startDate: Date;
      endDate: Date;
    },
    startDate: Date,
    endDate: Date,
  ): void => {
    if (
      startDate <
        academicYear.startDate ||
      endDate >
        academicYear.endDate
    ) {
      throw new AppError(
        "Semester dates must fall within the academic year",
        400,
      );
    }
  };

const checkSemesterOverlap =
  async (
    academicYearId: string,
    startDate: Date,
    endDate: Date,
    excludeId?: string,
  ): Promise<void> => {
    const overlappingSemester =
      await prisma.semester.findFirst({
        where: {
          academicYearId,

          ...(excludeId && {
            id: {
              not: excludeId,
            },
          }),

          AND: [
            {
              startDate: {
                lt: endDate,
              },
            },
            {
              endDate: {
                gt: startDate,
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
        },
      });

    if (overlappingSemester) {
      throw new AppError(
        `Semester overlaps with "${overlappingSemester.name}"`,
        409,
      );
    }
  };

export const createSemester = async (
  input: CreateSemesterInput,
) => {
  const academicYear =
    await prisma.academicYear.findUnique({
      where: {
        id: input.academicYearId,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });

  if (!academicYear) {
    throw new AppError(
      "Academic year not found",
      404,
    );
  }

  const startDate = new Date(
    input.startDate,
  );

  const endDate = new Date(
    input.endDate,
  );

  const registrationOpen =
    new Date(
      input.registrationOpen,
    );

  const registrationClose =
    new Date(
      input.registrationClose,
    );

  validateSemesterDates(
    startDate,
    endDate,
    registrationOpen,
    registrationClose,
  );

  validateAcademicYearBoundary(
    academicYear,
    startDate,
    endDate,
  );

  const existingCode =
    await prisma.semester.findFirst({
      where: {
        academicYearId:
          input.academicYearId,
        code: input.code,
      },
      select: {
        id: true,
      },
    });

  if (existingCode) {
    throw new AppError(
      "Semester code already exists in this academic year",
      409,
    );
  }

  await checkSemesterOverlap(
    input.academicYearId,
    startDate,
    endDate,
  );

  const semester =
    await prisma.semester.create({
      data: {
        academicYearId:
          input.academicYearId,

        name: input.name,

        code: input.code,

        type: input.type,

        startDate,

        endDate,

        registrationOpen,

        registrationClose,
      },

      include: {
        academicYear: true,
      },
    });

  return semester;
};

export const getSemesters = async (
  query: SemesterListQueryInput,
) => {
  const {
    page,
    limit,
    academicYearId,
    type,
    status,
    search,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.SemesterWhereInput =
    {
      ...(academicYearId && {
        academicYearId,
      }),

      ...(type && {
        type,
      }),

      ...(status && {
        status,
      }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

  const [
    semesters,
    total,
  ] = await prisma.$transaction([
    prisma.semester.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        academicYear: true,

        _count: {
          select: {
            courseOfferings: true,
            transcripts: true,
          },
        },
      },
    }),

    prisma.semester.count({
      where,
    }),
  ]);

  return {
    items: semesters,

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

export const getSemesterById = async (
  id: string,
) => {
  const semester =
    await prisma.semester.findUnique({
      where: {
        id,
      },

      include: {
        academicYear: true,

        courseOfferings: true,

        _count: {
          select: {
            transcripts: true,
          },
        },
      },
    });

  if (!semester) {
    throw new AppError(
      "Semester not found",
      404,
    );
  }

  return semester;
};

export const updateSemester = async (
  id: string,
  input: UpdateSemesterInput,
) => {
  const existingSemester =
    await prisma.semester.findUnique({
      where: {
        id,
      },

      include: {
        academicYear: true,
      },
    });

  if (!existingSemester) {
    throw new AppError(
      "Semester not found",
      404,
    );
  }

  if (
    existingSemester.status ===
      "COMPLETED" &&
    (
      input.startDate !== undefined ||
      input.endDate !== undefined ||
      input.registrationOpen !==
        undefined ||
      input.registrationClose !==
        undefined
    )
  ) {
    throw new AppError(
      "Completed semesters cannot have their dates modified",
      409,
    );
  }

  const startDate = input.startDate
    ? new Date(input.startDate)
    : existingSemester.startDate;

  const endDate = input.endDate
    ? new Date(input.endDate)
    : existingSemester.endDate;

  const registrationOpen =
    input.registrationOpen
      ? new Date(
          input.registrationOpen,
        )
      : existingSemester.registrationOpen;

  const registrationClose =
    input.registrationClose
      ? new Date(
          input.registrationClose,
        )
      : existingSemester.registrationClose;

  validateSemesterDates(
    startDate,
    endDate,
    registrationOpen,
    registrationClose,
  );

  validateAcademicYearBoundary(
    existingSemester.academicYear,
    startDate,
    endDate,
  );

  if (
    input.code !== undefined &&
    input.code !== existingSemester.code
  ) {
    const duplicate =
      await prisma.semester.findFirst({
        where: {
          academicYearId:
            existingSemester.academicYearId,

          code: input.code,

          id: {
            not: id,
          },
        },

        select: {
          id: true,
        },
      });

    if (duplicate) {
      throw new AppError(
        "Semester code already exists in this academic year",
        409,
      );
    }
  }

  if (
    input.startDate !== undefined ||
    input.endDate !== undefined
  ) {
    await checkSemesterOverlap(
      existingSemester.academicYearId,
      startDate,
      endDate,
      id,
    );
  }

  const updatedSemester =
    await prisma.semester.update({
      where: {
        id,
      },

      data: {
        ...(input.name !==
          undefined && {
          name: input.name,
        }),

        ...(input.code !==
          undefined && {
          code: input.code,
        }),

        ...(input.type !==
          undefined && {
          type: input.type,
        }),

        ...(input.startDate !==
          undefined && {
          startDate,
        }),

        ...(input.endDate !==
          undefined && {
          endDate,
        }),

        ...(input.registrationOpen !==
          undefined && {
          registrationOpen,
        }),

        ...(input.registrationClose !==
          undefined && {
          registrationClose,
        }),
      },

      include: {
        academicYear: true,
      },
    });

  return updatedSemester;
};

export const openSemesterRegistration =
  async (id: string) => {
    const semester =
      await prisma.semester.findUnique({
        where: {
          id,
        },
      });

    if (!semester) {
      throw new AppError(
        "Semester not found",
        404,
      );
    }

    if (
      semester.status !== "PLANNED"
    ) {
      throw new AppError(
        "Only planned semesters can open registration",
        409,
      );
    }

    const now = new Date();

    if (now < semester.registrationOpen) {
      throw new AppError(
        "Registration opening time has not been reached",
        409,
      );
    }

    if (now > semester.registrationClose) {
      throw new AppError(
        "Registration closing time has already passed",
        409,
      );
    }

    return prisma.semester.update({
      where: {
        id,
      },

      data: {
        status: "REGISTRATION_OPEN",
      },
    });
  };

export const closeSemesterRegistration =
  async (id: string) => {
    const semester =
      await prisma.semester.findUnique({
        where: {
          id,
        },
      });

    if (!semester) {
      throw new AppError(
        "Semester not found",
        404,
      );
    }

    if (
      semester.status !==
      "REGISTRATION_OPEN"
    ) {
      throw new AppError(
        "Registration is not currently open",
        409,
      );
    }

    return prisma.semester.update({
      where: {
        id,
      },

      data: {
        status:
          "REGISTRATION_CLOSED",
      },
    });
  };

export const activateSemester =
  async (id: string) => {
    const semester =
      await prisma.semester.findUnique({
        where: {
          id,
        },

        include: {
          academicYear: true,
        },
      });

    if (!semester) {
      throw new AppError(
        "Semester not found",
        404,
      );
    }

    if (
      semester.status !==
        "REGISTRATION_CLOSED" &&
      semester.status !==
        "REGISTRATION_OPEN"
    ) {
      throw new AppError(
        "Only a semester with registration completed can be activated",
        409,
      );
    }

    const now = new Date();

    if (
      now < semester.startDate
    ) {
      throw new AppError(
        "Semester start date has not been reached",
        409,
      );
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          await tx.semester.updateMany({
            where: {
              academicYearId:
                semester.academicYearId,

              status: "ACTIVE",

              id: {
                not: id,
              },
            },

            data: {
              status:
                "COMPLETED",
            },
          });

          return tx.semester.update({
            where: {
              id,
            },

            data: {
              status: "ACTIVE",
            },
          });
        },
      );

    return result;
  };

export const completeSemester =
  async (id: string) => {
    const semester =
      await prisma.semester.findUnique({
        where: {
          id,
        },
      });

    if (!semester) {
      throw new AppError(
        "Semester not found",
        404,
      );
    }

    if (
      semester.status !== "ACTIVE"
    ) {
      throw new AppError(
        "Only an active semester can be completed",
        409,
      );
    }

    const now = new Date();

    if (now < semester.endDate) {
      throw new AppError(
        "Semester end date has not been reached",
        409,
      );
    }

    return prisma.semester.update({
      where: {
        id,
      },

      data: {
        status: "COMPLETED",
      },
    });
  };