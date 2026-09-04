import jwt, {} from "jsonwebtoken";
import { env } from "../config/env.js";
const accessTokenOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
};
const refreshTokenOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
};
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOptions);
};
export const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "string" ||
        typeof decoded.role !== "string") {
        throw new Error("Invalid access token payload");
    }
    return {
        userId: decoded.userId,
        role: decoded.role,
    };
};
export const verifyRefreshToken = (token) => {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "string" ||
        typeof decoded.tokenId !== "string") {
        throw new Error("Invalid refresh token payload");
    }
    return {
        userId: decoded.userId,
        tokenId: decoded.tokenId,
    };
};
//# sourceMappingURL=jwt.js.map