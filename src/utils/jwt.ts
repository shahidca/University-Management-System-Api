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