import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import type {
      CreateSectionScheduleInput,
      SectionScheduleListQueryInput,
      UpdateSectionScheduleInput,
} from "./section-schedule.validation.js";

const sectionScheduleSelect = {
      id: true,
      sectionId: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      room: true,
      building: true,
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
            },
      },
} satisfies Prisma.SectionScheduleSelect;

const getSectionOrThrow = async (
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
                        isActive: true,
                        courseOffering: {
                              select: {
                                    id: true,
                                    isActive: true,
                                    semester: {
                                          select: {
                                                id: true,
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
            section.courseOffering.semester.status ===
            "COMPLETED"
      ) {
            throw new AppError(
                  "Schedules cannot be modified for a completed semester",
                  400,
            );
      }

      return section;
};

const validateScheduleConflict = async (
      sectionId: string,
      dayOfWeek: number,
      startTime: string,
      endTime: string,
      excludeScheduleId?: string,
) => {
      const section =
            await prisma.section.findUnique({
                  where: {
                        id: sectionId,
                  },
                  select: {
                        id: true,
                        instructorId: true,
                        courseOffering: {
                              select: {
                                    semesterId: true,
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

      /*
       * Check whether the same section already has
       * an overlapping schedule.
       *
       * Two ranges overlap when:
       *
       * existing.start < new.end
       * AND
       * existing.end > new.start
       */
      const sectionConflict =
            await prisma.sectionSchedule.findFirst({
                  where: {
                        sectionId,
                        dayOfWeek,

                        ...(excludeScheduleId
                              ? {
                                    id: {
                                          not: excludeScheduleId,
                                    },
                              }
                              : {}),

                        startTime: {
                              lt: endTime,
                        },

                        endTime: {
                              gt: startTime,
                        },
                  },
                  select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                  },
            });

      if (sectionConflict) {
            throw new AppError(
                  `Section already has a schedule conflict from ${sectionConflict.startTime} to ${sectionConflict.endTime}`,
                  409,
            );
      }

      /*
       * Check instructor conflict across other
       * sections belonging to the same semester.
       */
      const instructorConflict =
            await prisma.sectionSchedule.findFirst({
                  where: {
                        section: {
                              instructorId: section.instructorId,
                              courseOffering: {
                                    semesterId:
                                          section.courseOffering.semesterId,
                              },
                        },

                        dayOfWeek,

                        ...(excludeScheduleId
                              ? {
                                    id: {
                                          not: excludeScheduleId,
                                    },
                              }
                              : {}),

                        startTime: {
                              lt: endTime,
                        },

                        endTime: {
                              gt: startTime,
                        },
                  },

                  select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        section: {
                              select: {
                                    sectionCode: true,
                                    name: true,
                              },
                        },
                  },
            });

      if (instructorConflict) {
            throw new AppError(
                  `Instructor already has a schedule conflict with section ${instructorConflict.section.sectionCode} from ${instructorConflict.startTime} to ${instructorConflict.endTime}`,
                  409,
            );
      }
};

export const createSectionSchedule =
      async (
            input: CreateSectionScheduleInput,
      ) => {
            await getSectionOrThrow(
                  input.sectionId,
            );

            await validateScheduleConflict(
                  input.sectionId,
                  input.dayOfWeek,
                  input.startTime,
                  input.endTime,
            );

            try {
                  return await prisma.sectionSchedule.create({
                        data: {
                              sectionId: input.sectionId,
                              dayOfWeek: input.dayOfWeek,
                              startTime: input.startTime,
                              endTime: input.endTime,

                              ...(input.room !== undefined
                                    ? {
                                          room: input.room,
                                    }
                                    : {}),

                              ...(input.building !== undefined
                                    ? {
                                          building: input.building,
                                    }
                                    : {}),
                        },
                        select: sectionScheduleSelect,
                  });
            } catch (error) {
                  if (
                        error instanceof
                        Prisma.PrismaClientKnownRequestError &&
                        error.code === "P2002"
                  ) {
                        throw new AppError(
                              "This schedule already exists for the section",
                              409,
                        );
                  }

                  throw error;
            }
      };

export const getSectionSchedules =
      async (
            query: SectionScheduleListQueryInput,
      ) => {
            const {
                  page,
                  limit,
                  sectionId,
                  dayOfWeek,
                  room,
                  building,
                  sortBy,
                  sortOrder,
            } = query;

            const where: Prisma.SectionScheduleWhereInput =
            {
                  ...(sectionId
                        ? {
                              sectionId,
                        }
                        : {}),

                  ...(dayOfWeek !== undefined
                        ? {
                              dayOfWeek,
                        }
                        : {}),

                  ...(room
                        ? {
                              room: {
                                    contains: room,
                                    mode: "insensitive",
                              },
                        }
                        : {}),

                  ...(building
                        ? {
                              building: {
                                    contains: building,
                                    mode: "insensitive",
                              },
                        }
                        : {}),
            };

            const skip = (page - 1) * limit;

            const orderBy: Prisma.SectionScheduleOrderByWithRelationInput =
            {
                  [sortBy]: sortOrder,
            };

            const [
                  schedules,
                  total,
            ] = await prisma.$transaction([
                  prisma.sectionSchedule.findMany({
                        where,
                        skip,
                        take: limit,
                        orderBy,
                        select: sectionScheduleSelect,
                  }),

                  prisma.sectionSchedule.count({
                        where,
                  }),
            ]);

            return {
                  items: schedules,
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

export const getSectionScheduleById =
      async (
            id: string,
      ) => {
            const schedule =
                  await prisma.sectionSchedule.findUnique(
                        {
                              where: {
                                    id,
                              },
                              select: sectionScheduleSelect,
                        },
                  );

            if (!schedule) {
                  throw new AppError(
                        "Section schedule not found",
                        404,
                  );
            }

            return schedule;
      };

export const updateSectionSchedule =
      async (
            id: string,
            input: UpdateSectionScheduleInput,
      ) => {
            const existing =
                  await prisma.sectionSchedule.findUnique(
                        {
                              where: {
                                    id,
                              },
                              select: {
                                    id: true,
                                    sectionId: true,
                                    dayOfWeek: true,
                                    startTime: true,
                                    endTime: true,
                              },
                        },
                  );

            if (!existing) {
                  throw new AppError(
                        "Section schedule not found",
                        404,
                  );
            }

            await getSectionOrThrow(
                  existing.sectionId,
            );

            const dayOfWeek =
                  input.dayOfWeek ??
                  existing.dayOfWeek;

            const startTime =
                  input.startTime ??
                  existing.startTime;

            const endTime =
                  input.endTime ??
                  existing.endTime;

            if (startTime >= endTime) {
                  throw new AppError(
                        "Start time must be earlier than end time",
                        400,
                  );
            }

            await validateScheduleConflict(
                  existing.sectionId,
                  dayOfWeek,
                  startTime,
                  endTime,
                  id,
            );

            try {
                  return await prisma.sectionSchedule.update(
                        {
                              where: {
                                    id,
                              },
                              data: {
                                    ...(input.dayOfWeek !== undefined
                                          ? {
                                                dayOfWeek:
                                                      input.dayOfWeek,
                                          }
                                          : {}),

                                    ...(input.startTime !== undefined
                                          ? {
                                                startTime:
                                                      input.startTime,
                                          }
                                          : {}),

                                    ...(input.endTime !== undefined
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

                                    ...(input.building !== undefined
                                          ? {
                                                building:
                                                      input.building,
                                          }
                                          : {}),
                              },
                              select: sectionScheduleSelect,
                        },
                  );
            } catch (error) {
                  if (
                        error instanceof
                        Prisma.PrismaClientKnownRequestError &&
                        error.code === "P2002"
                  ) {
                        throw new AppError(
                              "This schedule already exists for the section",
                              409,
                        );
                  }

                  throw error;
            }
      };

export const deleteSectionSchedule =
      async (
            id: string,
      ) => {
            const existing =
                  await prisma.sectionSchedule.findUnique(
                        {
                              where: {
                                    id,
                              },
                              select: {
                                    id: true,
                                    sectionId: true,
                              },
                        },
                  );

            if (!existing) {
                  throw new AppError(
                        "Section schedule not found",
                        404,
                  );
            }

            await getSectionOrThrow(
                  existing.sectionId,
            );

            await prisma.sectionSchedule.delete({
                  where: {
                        id,
                  },
            });

            return {
                  id,
                  deleted: true,
            };
      };