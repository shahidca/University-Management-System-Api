import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
export const authenticate = (req, _res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new AppError("Authentication required", 401);
    }
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" ||
        !token) {
        throw new AppError("Invalid authorization header", 401);
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            userId: payload.userId,
            role: payload.role,
        };
        next();
    }
    catch {
        throw new AppError("Invalid or expired access token", 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map