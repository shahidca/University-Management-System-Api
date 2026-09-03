import { randomUUID } from "node:crypto";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import {
  hashPassword,
  comparePassword,
} from "../../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { hashToken } from "../../utils/token.js";

import type {
  LoginSchemaInput,
  LogoutSchemaInput,
  RefreshTokenSchemaInput,
  RegisterSchemaInput,
} from "./auth.validation.js";

export const registerUser = async (
  input: RegisterSchemaInput,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists",
      409,
    );
  }

  const passwordHash = await hashPassword(
    input.password,
  );

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

export const loginUser = async (
  input: LoginSchemaInput,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(
      "Your account is not active",
      403,
    );
  }

  if (!user.passwordHash) {
    throw new AppError(
      "This account does not support password login",
      401,
    );
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
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

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: getRefreshTokenExpiry(),
      },
    }),

    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    }),
  ]);

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

const getRefreshTokenExpiry = (): Date => {
  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 7,
  );

  return expiresAt;
};

export const refreshUserToken = async (
  input: RefreshTokenSchemaInput,
) => {
  let payload;

  try {
    payload = verifyRefreshToken(
      input.refreshToken,
    );
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
    );
  }

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        id: payload.tokenId,
      },
      include: {
        user: true,
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Refresh token not found",
      401,
    );
  }

  if (storedToken.revokedAt) {
    throw new AppError(
      "Refresh token has been revoked",
      401,
    );
  }

  if (
    storedToken.expiresAt <= new Date()
  ) {
    throw new AppError(
      "Refresh token has expired",
      401,
    );
  }

  const tokenMatches = hashToken(
    input.refreshToken,
  ) === storedToken.tokenHash;

  if (!tokenMatches) {
    throw new AppError(
      "Invalid refresh token",
      401,
    );
  }

  if (storedToken.user.status !== "ACTIVE") {
    throw new AppError(
      "Your account is not active",
      403,
    );
  }

  const newTokenId = randomUUID();

  const newAccessToken =
    generateAccessToken({
      userId: storedToken.user.id,
      role: storedToken.user.role,
    });

  const newRefreshToken =
    generateRefreshToken({
      userId: storedToken.user.id,
      tokenId: newTokenId,
    });

  const newRefreshTokenHash =
    hashToken(newRefreshToken);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    }),

    prisma.refreshToken.create({
      data: {
        id: newTokenId,
        userId: storedToken.user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: getRefreshTokenExpiry(),
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (
  input: LogoutSchemaInput,
) => {
  let payload;

  try {
    payload = verifyRefreshToken(
      input.refreshToken,
    );
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
    );
  }

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        id: payload.tokenId,
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Refresh token not found",
      401,
    );
  }

  if (storedToken.revokedAt) {
    return;
  }

  const tokenMatches = hashToken(
    input.refreshToken,
  ) === storedToken.tokenHash;

  if (!tokenMatches) {
    throw new AppError(
      "Invalid refresh token",
      401,
    );
  }

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const getCurrentUser = async (
  userId: string,
) => {
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
    throw new AppError(
      "User account not found",
      404,
    );
  }

  return user;
};