import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

import { env } from "../config/env.js";

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

const accessTokenOptions: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
};

export const generateAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    accessTokenOptions,
  );
};

export const generateRefreshToken = (
  payload: RefreshTokenPayload,
): string => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    refreshTokenOptions,
  );
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  const decoded = jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: decoded.userId,
    role: decoded.role,
  };
};

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  const decoded = jwt.verify(
    token,
    env.JWT_REFRESH_SECRET,
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string" ||
    typeof decoded.tokenId !== "string"
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return {
    userId: decoded.userId,
    tokenId: decoded.tokenId,
  };
};