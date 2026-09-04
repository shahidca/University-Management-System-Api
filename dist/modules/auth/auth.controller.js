import { sendSuccess } from "../../utils/api-response.js";
import { googleLogin } from "./auth.service.js";
import { forgotPassword, getCurrentUser, loginUser, logoutUser, refreshUserToken, registerUser, resendVerificationOtp, resetPassword, verifyUserEmail, } from "./auth.service.js";
export const register = async (req, res) => {
    const user = await registerUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", user);
};
export const login = async (req, res) => {
    const result = await loginUser(req.body);
    return sendSuccess(res, 200, "Login successful", result);
};
export const refresh = async (req, res) => {
    const result = await refreshUserToken(req.body);
    return sendSuccess(res, 200, "Access token refreshed successfully", result);
};
export const logout = async (req, res) => {
    await logoutUser(req.body);
    return sendSuccess(res, 200, "Logout successful", null);
};
export const getMe = async (req, res) => {
    if (!req.user) {
        throw new Error("Authenticated user context is missing");
    }
    const user = await getCurrentUser(req.user.userId);
    return sendSuccess(res, 200, "Current user retrieved successfully", user);
};
export const verifyEmail = async (req, res) => {
    const user = await verifyUserEmail(req.body);
    return sendSuccess(res, 200, "Email verified successfully", user);
};
export const resendVerification = async (req, res) => {
    await resendVerificationOtp(req.body);
    return sendSuccess(res, 200, "If the account exists and is not verified, a new verification code has been sent", null);
};
export const forgotPasswordController = async (req, res) => {
    await forgotPassword(req.body);
    return sendSuccess(res, 200, "If the account exists and is eligible, a password reset code has been sent", null);
};
export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);
    return sendSuccess(res, 200, "Password reset successfully. Please log in again", null);
};
export const googleLoginController = async (req, res) => {
    const result = await googleLogin(req.body.idToken);
    sendSuccess(res, 200, "Google login successful", result);
};
//# sourceMappingURL=auth.controller.js.map