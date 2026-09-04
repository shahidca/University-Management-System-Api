import { AppError } from "../utils/app-error.js";
export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError("You do not have permission to access this resource", 403);
        }
        next();
    };
};
//# sourceMappingURL=rbac.middleware.js.map