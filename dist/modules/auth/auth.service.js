import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { hashPassword } from "../../utils/password.js";
export const registerUser = async (input) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
        select: {
            id: true,
        },
    });
    if (existingUser) {
        throw new AppError("An account with this email already exists", 409);
    }
    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
        data: {
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            role: "STUDENT",
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerifiedAt: true,
            createdAt: true,
        },
    });
    return user;
};
export const loginUser = async (_input) => {
    throw new AppError("Authentication login service is not implemented yet", 501);
};
//# sourceMappingURL=auth.service.js.map