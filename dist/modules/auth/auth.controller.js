import { sendSuccess } from "../../utils/api-response.js";
import { loginUser, registerUser, } from "./auth.service.js";
export const register = async (req, res) => {
    const user = await registerUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", user);
};
export const login = async (req, res) => {
    const result = await loginUser(req.body);
    return sendSuccess(res, 200, "Login successful", result);
};
//# sourceMappingURL=auth.controller.js.map