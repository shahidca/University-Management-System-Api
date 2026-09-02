import { sendSuccess } from "../../utils/api-response.js";
import { getCurrentUser, loginUser, registerUser, } from "./auth.service.js";
export const register = async (req, res) => {
    const user = await registerUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", user);
};
export const login = async (req, res) => {
    const result = await loginUser(req.body);
    return sendSuccess(res, 200, "Login successful", result);
};
export const getMe = async (req, res) => {
    if (!req.user) {
        throw new Error("Authenticated user context is missing");
    }
    const user = await getCurrentUser(req.user.userId);
    return sendSuccess(res, 200, "Current user retrieved successfully", user);
};
//# sourceMappingURL=auth.controller.js.map