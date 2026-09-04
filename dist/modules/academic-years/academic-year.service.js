import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
const validateDateRange = (startDate, endDate) => {
    if (startDate >= endDate) {
        throw new AppError("Start date must be before end date", 400);
    }
};
const checkDateOverlap = async (startDate, endDate, excludeId) => {
    const overlappingYear = await prisma.academicYear.findFirst({
        where: {
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
    if (overlappingYear) {
        throw new AppError(`Academic year overlaps with "${overlappingYear.name}"`, 409);
    }
};
export const createAcademicYear = async (input) => {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    validateDateRange(startDate, endDate);
    const existingYear = await prisma.academicYear.findUnique({
        where: {
            name: input.name,
        },
        select: {
            id: true,
        },
    });
    if (existingYear) {
        throw new AppError("Academic year already exists", 409);
    }
    await checkDateOverlap(startDate, endDate);
    const academicYear = await prisma.academicYear.create({
        data: {
            name: input.name,
            startDate,
            endDate,
        },
    });
    return academicYear;
};
export const getAcademicYears = async (query) => {
    const { page, limit, search, isActive, sortBy, sortOrder, } = query;
    const skip = (page - 1) * limit;
    const where = {
        ...(search && {
            name: {
                contains: search,
                mode: "insensitive",
            },
        }),
        ...(isActive !== undefined && {
            isActive,
        }),
    };
    const [academicYears, total,] = await prisma.$transaction([
        prisma.academicYear.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
        }),
        prisma.academicYear.count({
            where,
        }),
    ]);
    return {
        items: academicYears,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const getAcademicYearById = async (id) => {
    const academicYear = await prisma.academicYear.findUnique({
        where: {
            id,
        },
        include: {
            semesters: true,
        },
    });
    if (!academicYear) {
        throw new AppError("Academic year not found", 404);
    }
    return academicYear;
};
export const updateAcademicYear = async (id, input) => {
    const existingYear = await prisma.academicYear.findUnique({
        where: {
            id,
        },
    });
    if (!existingYear) {
        throw new AppError("Academic year not found", 404);
    }
    const startDate = input.startDate
        ? new Date(input.startDate)
        : existingYear.startDate;
    const endDate = input.endDate
        ? new Date(input.endDate)
        : existingYear.endDate;
    validateDateRange(startDate, endDate);
    if (input.name !== undefined &&
        input.name !== existingYear.name) {
        const duplicate = await prisma.academicYear.findUnique({
            where: {
                name: input.name,
            },
            select: {
                id: true,
            },
        });
        if (duplicate) {
            throw new AppError("Academic year name already exists", 409);
        }
    }
    if (input.startDate !== undefined ||
        input.endDate !== undefined) {
        await checkDateOverlap(startDate, endDate, id);
    }
    const updatedYear = await prisma.academicYear.update({
        where: {
            id,
        },
        data: {
            ...(input.name !== undefined && {
                name: input.name,
            }),
            ...(input.startDate !==
                undefined && {
                startDate,
            }),
            ...(input.endDate !==
                undefined && {
                endDate,
            }),
        },
    });
    return updatedYear;
};
export const activateAcademicYear = async (id) => {
    const academicYear = await prisma.academicYear.findUnique({
        where: {
            id,
        },
    });
    if (!academicYear) {
        throw new AppError("Academic year not found", 404);
    }
    const result = await prisma.$transaction(async (tx) => {
        await tx.academicYear.updateMany({
            where: {
                isActive: true,
                id: {
                    not: id,
                },
            },
            data: {
                isActive: false,
            },
        });
        return tx.academicYear.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
        });
    });
    return result;
};
export const deactivateAcademicYear = async (id) => {
    const academicYear = await prisma.academicYear.findUnique({
        where: {
            id,
        },
    });
    if (!academicYear) {
        throw new AppError("Academic year not found", 404);
    }
    if (!academicYear.isActive) {
        throw new AppError("Academic year is already inactive", 409);
    }
    const semesters = await prisma.semester.count({
        where: {
            academicYearId: id,
            status: "ACTIVE",
        },
    });
    if (semesters > 0) {
        throw new AppError("Cannot deactivate an academic year with an active semester", 409);
    }
    return prisma.academicYear.update({
        where: {
            id,
        },
        data: {
            isActive: false,
        },
    });
};
//# sourceMappingURL=academic-year.service.js.map