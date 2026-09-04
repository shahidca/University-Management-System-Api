import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
const courseSelect = {
    id: true,
    code: true,
    title: true,
    credits: true,
    courseType: true,
    level: true,
    isActive: true,
    deletedAt: true,
};
const ensureActiveCourse = async (courseId, message) => {
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            deletedAt: null,
            isActive: true,
        },
        select: courseSelect,
    });
    if (!course) {
        throw new AppError(message, 404);
    }
    return course;
};
export const createCoursePrerequisite = async (input) => {
    if (input.courseId ===
        input.prerequisiteId) {
        throw new AppError("A course cannot be its own prerequisite", 400);
    }
    const [course, prerequisite,] = await Promise.all([
        ensureActiveCourse(input.courseId, "Course not found or inactive"),
        ensureActiveCourse(input.prerequisiteId, "Prerequisite course not found or inactive"),
    ]);
    const existing = await prisma.coursePrerequisite.findUnique({
        where: {
            courseId_prerequisiteId: {
                courseId: input.courseId,
                prerequisiteId: input.prerequisiteId,
            },
        },
    });
    if (existing) {
        throw new AppError("This prerequisite already exists", 409);
    }
    const prerequisiteRecord = await prisma.coursePrerequisite.create({
        data: {
            courseId: input.courseId,
            prerequisiteId: input.prerequisiteId,
            minimumGrade: input.minimumGrade ??
                null,
        },
        include: {
            course: {
                select: courseSelect,
            },
            prerequisite: {
                select: courseSelect,
            },
        },
    });
    return {
        ...prerequisiteRecord,
        course,
        prerequisite,
    };
};
export const getCoursePrerequisites = async (query) => {
    const { courseId, prerequisiteId, page, limit, } = query;
    const skip = (page - 1) * limit;
    const where = {
        ...(courseId && {
            courseId,
        }),
        ...(prerequisiteId && {
            prerequisiteId,
        }),
    };
    const [items, total,] = await prisma.$transaction([
        prisma.coursePrerequisite.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                course: {
                    select: courseSelect,
                },
                prerequisite: {
                    select: courseSelect,
                },
            },
        }),
        prisma.coursePrerequisite.count({
            where,
        }),
    ]);
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const getCoursePrerequisiteById = async (id) => {
    const record = await prisma.coursePrerequisite.findUnique({
        where: {
            id,
        },
        include: {
            course: {
                select: courseSelect,
            },
            prerequisite: {
                select: courseSelect,
            },
        },
    });
    if (!record) {
        throw new AppError("Course prerequisite not found", 404);
    }
    return record;
};
export const updateCoursePrerequisite = async (id, input) => {
    const existing = await prisma.coursePrerequisite.findUnique({
        where: {
            id,
        },
    });
    if (!existing) {
        throw new AppError("Course prerequisite not found", 404);
    }
    const updated = await prisma.coursePrerequisite.update({
        where: {
            id,
        },
        data: {
            ...(input.minimumGrade !==
                undefined && {
                minimumGrade: input.minimumGrade,
            }),
        },
        include: {
            course: {
                select: courseSelect,
            },
            prerequisite: {
                select: courseSelect,
            },
        },
    });
    return updated;
};
export const deleteCoursePrerequisite = async (id) => {
    const existing = await prisma.coursePrerequisite.findUnique({
        where: {
            id,
        },
    });
    if (!existing) {
        throw new AppError("Course prerequisite not found", 404);
    }
    await prisma.coursePrerequisite.delete({
        where: {
            id,
        },
    });
};
//# sourceMappingURL=course-prerequisite.service.js.map