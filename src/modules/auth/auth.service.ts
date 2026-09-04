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


import { verifyGoogleIdToken } from "./google.service.js";
import type {
  LoginSchemaInput,
  LogoutSchemaInput,
  RefreshTokenSchemaInput,
  RegisterSchemaInput,
  VerifyEmailSchemaInput,
  ResendVerificationSchemaInput,
  ForgotPasswordSchemaInput,
  ResetPasswordSchemaInput,
} from "./auth.validation.js";

import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../../utils/email.js";

import {
  generateOtp,
  getOtpExpiry,
  hashOtp,
} from "../../utils/otp.js";



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

  const otp = generateOtp();

  const otpHash = hashOtp(otp);

  await prisma.oTP.create({
    data: {
      userId: user.id,
      codeHash: otpHash,
      expiresAt: getOtpExpiry(10),
    },
  });

  try {
    await sendVerificationEmail(
      user.email,
      user.firstName,
      otp,
    );
  } catch (error) {
    console.error(
      "Failed to send verification email:",
      error,
    );
  }

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

  if (!user.emailVerifiedAt) {
    throw new AppError(
      "Please verify your email before logging in",
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

export const verifyUserEmail = async (
  input: VerifyEmailSchemaInput,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
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

  if (!user) {
    throw new AppError(
      "Invalid email or verification code",
      400,
    );
  }

  if (user.emailVerifiedAt) {
    throw new AppError(
      "Email address is already verified",
      409,
    );
  }

  const otpRecord = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      verifiedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new AppError(
      "Verification code not found. Please request a new code",
      400,
    );
  }

  if (otpRecord.expiresAt <= new Date()) {
    throw new AppError(
      "Verification code has expired. Please request a new code",
      400,
    );
  }

  const MAX_OTP_ATTEMPTS = 5;

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    throw new AppError(
      "Too many incorrect verification attempts. Please request a new code",
      429,
    );
  }

  const providedOtpHash = hashOtp(input.otp);

  const otpMatches =
    providedOtpHash === otpRecord.codeHash;

  if (!otpMatches) {
    const updatedOtp =
      await prisma.oTP.updateMany({
        where: {
          id: otpRecord.id,
          attempts: {
            lt: MAX_OTP_ATTEMPTS,
          },
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

    if (updatedOtp.count === 0) {
      throw new AppError(
        "Too many incorrect verification attempts. Please request a new code",
        429,
      );
    }

    throw new AppError(
      "Invalid verification code",
      400,
    );
  }

  const verifiedAt = new Date();

  await prisma.$transaction([
    prisma.oTP.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verifiedAt,
      },
    }),

    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerifiedAt: verifiedAt,
      },
    }),
  ]);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    emailVerifiedAt: verifiedAt,
    createdAt: user.createdAt,
  };
};

export const resendVerificationOtp = async (
  input: ResendVerificationSchemaInput,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      emailVerifiedAt: true,
    },
  });

  /*
   * Do not reveal whether an email address
   * exists in the system.
   */
  if (!user || user.emailVerifiedAt) {
    return;
  }

  const now = new Date();

  const latestOtp = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      verifiedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * Prevent OTP spam.
   * A new OTP can only be requested
   * once every 60 seconds.
   */
  if (latestOtp) {
    const cooldownMs = 60 * 1000;
    const elapsedMs =
      now.getTime() -
      latestOtp.createdAt.getTime();

    if (elapsedMs < cooldownMs) {
      throw new AppError(
        "Please wait before requesting another verification code",
        429,
      );
    }
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  /*
   * Invalidate previous unused OTPs
   * and create the new OTP together.
   */
  await prisma.$transaction([
    prisma.oTP.updateMany({
      where: {
        userId: user.id,
        verifiedAt: null,
      },
      data: {
        verifiedAt: now,
      },
    }),

    prisma.oTP.create({
      data: {
        userId: user.id,
        codeHash: otpHash,
        expiresAt: getOtpExpiry(10),
      },
    }),
  ]);

  try {
    await sendVerificationEmail(
      user.email,
      user.firstName,
      otp,
    );
  } catch (error) {
    console.error(
      "Failed to send verification email:",
      error,
    );

    throw new AppError(
      "Unable to send verification email. Please try again later",
      503,
    );
  }
};

export const forgotPassword = async (
  input: ForgotPasswordSchemaInput,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      emailVerifiedAt: true,
    },
  });

  /*
   * Do not reveal whether the account exists.
   */
  if (!user) {
    return;
  }

  /*
   * Password reset should only be available
   * to verified email accounts.
   */
  if (!user.emailVerifiedAt) {
    return;
  }

  const now = new Date();

  const latestOtp = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      verifiedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * 60-second cooldown.
   */
  if (latestOtp) {
    const cooldownMs = 60 * 1000;

    const elapsedMs =
      now.getTime() -
      latestOtp.createdAt.getTime();

    if (elapsedMs < cooldownMs) {
      throw new AppError(
        "Please wait before requesting another password reset code",
        429,
      );
    }
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  await prisma.$transaction([
    /*
     * Invalidate previous unused OTPs.
     */
    prisma.oTP.updateMany({
      where: {
        userId: user.id,
        verifiedAt: null,
      },
      data: {
        verifiedAt: now,
      },
    }),

    prisma.oTP.create({
      data: {
        userId: user.id,
        codeHash: otpHash,
        expiresAt: getOtpExpiry(10),
      },
    }),
  ]);

  try {
    await sendPasswordResetEmail(
      user.email,
      user.firstName,
      otp,
    );
  } catch (error) {
    console.error(
      "Failed to send password reset email:",
      error,
    );

    throw new AppError(
      "Unable to send password reset email. Please try again later",
      503,
    );
  }
};

export const resetPassword = async (
  input: ResetPasswordSchemaInput,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid email or reset code",
      400,
    );
  }

  if (!user.emailVerifiedAt) {
    throw new AppError(
      "Please verify your email before resetting your password",
      403,
    );
  }

  const otpRecord = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      verifiedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new AppError(
      "Password reset code not found. Please request a new code",
      400,
    );
  }

  if (otpRecord.expiresAt <= new Date()) {
    throw new AppError(
      "Password reset code has expired. Please request a new code",
      400,
    );
  }

  const MAX_OTP_ATTEMPTS = 5;

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    throw new AppError(
      "Too many incorrect attempts. Please request a new code",
      429,
    );
  }

  const providedOtpHash = hashOtp(input.otp);

  const otpMatches =
    providedOtpHash === otpRecord.codeHash;

  if (!otpMatches) {
    const updatedOtp =
      await prisma.oTP.updateMany({
        where: {
          id: otpRecord.id,
          attempts: {
            lt: MAX_OTP_ATTEMPTS,
          },
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

    if (updatedOtp.count === 0) {
      throw new AppError(
        "Too many incorrect attempts. Please request a new code",
        429,
      );
    }

    throw new AppError(
      "Invalid password reset code",
      400,
    );
  }

  const passwordHash =
    await hashPassword(input.newPassword);

  const now = new Date();

  await prisma.$transaction([
    /*
     * Mark reset OTP as consumed.
     */
    prisma.oTP.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verifiedAt: now,
      },
    }),

    /*
     * Update password.
     */
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        passwordChangedAt: now,
      },
    }),

    /*
     * Revoke every existing refresh token.
     *
     * This logs the user out from other sessions.
     */
    prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    }),
  ]);
};

export const googleLogin = async (
  idToken: string,
) => {
  const googleUser =
    await verifyGoogleIdToken(idToken);

  /*
   * 1. First find an account already linked
   *    to this Google account.
   */
  const existingGoogleUser =
    await prisma.user.findUnique({
      where: {
        googleId: googleUser.googleId,
      },
    });

  /*
   * Existing Google account
   */
  if (existingGoogleUser) {
    if (existingGoogleUser.status !== "ACTIVE") {
      throw new AppError(
        "Your account is not active",
        403,
      );
    }

    if (existingGoogleUser.role !== "STUDENT") {
      throw new AppError(
        "Google login is available only for student accounts",
        403,
      );
    }

    return createGoogleAuthSession(
      existingGoogleUser.id,
      existingGoogleUser.role,
      existingGoogleUser.email,
      existingGoogleUser.firstName,
      existingGoogleUser.lastName,
      existingGoogleUser.status,
    );
  }

  /*
   * 2. No Google account found.
   *
   * Check whether an account already exists
   * with the verified Google email.
   */
  const existingEmailUser =
    await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

  /*
   * Existing account with same email
   */
  if (existingEmailUser) {
    if (existingEmailUser.status !== "ACTIVE") {
      throw new AppError(
        "Your account is not active",
        403,
      );
    }

    /*
     * Google login is only allowed for students.
     */
    if (existingEmailUser.role !== "STUDENT") {
      throw new AppError(
        "Google login is available only for student accounts",
        403,
      );
    }

    /*
     * Link the verified Google account to the
     * existing student account.
     */
    const linkedUser =
      await prisma.user.update({
        where: {
          id: existingEmailUser.id,
        },
        data: {
          googleId: googleUser.googleId,
          emailVerifiedAt:
            existingEmailUser.emailVerifiedAt ??
            new Date(),
        },
      });

    return createGoogleAuthSession(
      linkedUser.id,
      linkedUser.role,
      linkedUser.email,
      linkedUser.firstName,
      linkedUser.lastName,
      linkedUser.status,
    );
  }

  /*
   * 3. No existing account.
   *
   * Google accounts can ONLY create STUDENT users.
   */
  const newUser = await prisma.user.create({
    data: {
      email: googleUser.email,
      googleId: googleUser.googleId,
      passwordHash: null,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      role: "STUDENT",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  return createGoogleAuthSession(
    newUser.id,
    newUser.role,
    newUser.email,
    newUser.firstName,
    newUser.lastName,
    newUser.status,
  );
};

export const createGoogleAuthSession = async (
  userId: string,
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN",
  email: string,
  firstName: string,
  lastName: string,
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
) => {
  const tokenId = randomUUID();

  const accessToken = generateAccessToken({
    userId,
    role,
  });

  const refreshToken = generateRefreshToken({
    userId,
    tokenId,
  });

  const refreshTokenHash =
    hashToken(refreshToken);

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        tokenHash: refreshTokenHash,
        expiresAt: getRefreshTokenExpiry(),
      },
    }),

    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    }),
  ]);

  return {
    user: {
      id: userId,
      email,
      firstName,
      lastName,
      role,
      status,
    },
    accessToken,
    refreshToken,
  };
};