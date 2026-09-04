import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
export const verifyGoogleIdToken = async (idToken) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new AppError("Invalid Google ID token", 401);
        }
        if (!payload.sub) {
            throw new AppError("Google account identifier is missing", 401);
        }
        if (!payload.email) {
            throw new AppError("Google account email is missing", 401);
        }
        if (payload.email_verified !== true) {
            throw new AppError("Google email is not verified", 401);
        }
        return {
            googleId: payload.sub,
            email: payload.email.toLowerCase(),
            firstName: payload.given_name?.trim() || "Student",
            lastName: payload.family_name?.trim() || "",
            picture: payload.picture,
        };
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Invalid or expired Google ID token", 401);
    }
};
//# sourceMappingURL=google.service.js.map