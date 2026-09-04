import type { LoginSchemaInput, LogoutSchemaInput, RefreshTokenSchemaInput, RegisterSchemaInput, VerifyEmailSchemaInput, ResendVerificationSchemaInput, ForgotPasswordSchemaInput, ResetPasswordSchemaInput } from "./auth.validation.js";
export declare const registerUser: (input: RegisterSchemaInput) => Promise<{
    createdAt: Date;
    email: string;
    emailVerifiedAt: Date | null;
    firstName: string;
    id: string;
    lastName: string;
    role: import("@prisma/client").$Enums.Role;
    status: import("@prisma/client").$Enums.UserStatus;
}>;
export declare const loginUser: (input: LoginSchemaInput) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        status: "ACTIVE";
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshUserToken: (input: RefreshTokenSchemaInput) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const logoutUser: (input: LogoutSchemaInput) => Promise<void>;
export declare const getCurrentUser: (userId: string) => Promise<{
    createdAt: Date;
    email: string;
    emailVerifiedAt: Date | null;
    firstName: string;
    id: string;
    lastLoginAt: Date | null;
    lastName: string;
    role: import("@prisma/client").$Enums.Role;
    status: import("@prisma/client").$Enums.UserStatus;
    updatedAt: Date;
}>;
export declare const verifyUserEmail: (input: VerifyEmailSchemaInput) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: import("@prisma/client").$Enums.Role;
    status: import("@prisma/client").$Enums.UserStatus;
    emailVerifiedAt: Date;
    createdAt: Date;
}>;
export declare const resendVerificationOtp: (input: ResendVerificationSchemaInput) => Promise<void>;
export declare const forgotPassword: (input: ForgotPasswordSchemaInput) => Promise<void>;
export declare const resetPassword: (input: ResetPasswordSchemaInput) => Promise<void>;
export declare const googleLogin: (idToken: string) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const createGoogleAuthSession: (userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN", email: string, firstName: string, lastName: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    };
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map