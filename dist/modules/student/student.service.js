import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
const generateStudentId = async () => {
    const year = new Date().getFullYear();
    const latestStudent = await prisma.studentProfile.findFirst({
        where: {
            studentId: {
                startsWith: `STU-${year}-`,
            },
        },
        orderBy: {
            studentId: "desc",
        },
        select: {
            studentId: true,
        },
    });
    let nextNumber = 1;
    if (latestStudent) {
        const lastNumber = Number(latestStudent.studentId.split("-").at(-1));
        if (Number.isInteger(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }
    return `STU-${year}-${nextNumber
        .toString()
        .padStart(6, "0")}`;
};
export const createStudentProfile = async (userId, input) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
            studentProfile: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.role !== "STUDENT") {
        throw new AppError("Only students can create a student profile", 403);
    }
    if (user.studentProfile) {
        throw new AppError("Student profile already exists", 409);
    }
    const program = await prisma.program.findUnique({
        where: {
            id: input.programId,
        },
        select: {
            id: true,
        },
    });
    if (!program) {
        throw new AppError("Program not found", 404);
    }
    const studentId = await generateStudentId();
    const studentProfile = await prisma.studentProfile.create({
        data: {
            userId: user.id,
            programId: program.id,
            studentId,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: input.dateOfBirth
                ? new Date(input.dateOfBirth)
                : null,
            phone: input.phone ?? null,
            address: input.address ?? null,
            admissionDate: new Date(),
        },
        include: {
            program: true,
        },
    });
    return studentProfile;
};
export const getStudentProfile = async (userId) => {
    const studentProfile = await prisma.studentProfile.findUnique({
        where: {
            userId,
        },
        include: {
            program: true,
        },
    });
    if (!studentProfile) {
        throw new AppError("Student profile not found", 404);
    }
    return studentProfile;
};
export const updateStudentProfile = async (userId, input) => {
    const existingProfile = await prisma.studentProfile.findUnique({
        where: {
            userId,
        },
    });
    if (!existingProfile) {
        throw new AppError("Student profile not found", 404);
    }
    const updatedProfile = await prisma.studentProfile.update({
        where: {
            userId,
        },
        data: {
            ...(input.dateOfBirth !== undefined && {
                dateOfBirth: new Date(input.dateOfBirth),
            }),
            ...(input.phone !== undefined && {
                phone: input.phone,
            }),
            ...(input.address !== undefined && {
                address: input.address,
            }),
        },
        include: {
            program: true,
        },
    });
    return updatedProfile;
};
//# sourceMappingURL=student.service.js.map