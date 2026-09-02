import { randomUUID } from "node:crypto";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateAccessToken, generateRefreshToken, } from "../../utils/jwt.js";
import { hashToken } from "../../utils/token.js";
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
export const loginUser = async (input) => {
    const user = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
    });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    if (user.status !== "ACTIVE") {
        throw new AppError("Your account is not active", 403);
    }
    if (!user.passwordHash) {
        throw new AppError("This account does not support password login", 401);
    }
    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
        throw new AppError("Invalid email or password", 401);
    }
    const tokenId = randomUUID();
    const accessToken = generateAccessToken({
        userId: user.id,
        role: user.role,
    });
    const refreshToken = generateRefreshToken({
        userId: user.id,
        tokenId,
    });
    const refreshTokenHash = hashToken(refreshToken);
    await prisma.refreshToken.create({
        data: {
            id: tokenId,
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresAt: getRefreshTokenExpiry(),
        },
    });
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            lastLoginAt: new Date(),
        },
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
        },
        accessToken,
        refreshToken,
    };
};
const getRefreshTokenExpiry = () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
};
export const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerifiedAt: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError("User account not found", 404);
    }
    return user;
};
//# sourceMappingURL=auth.service.js.map