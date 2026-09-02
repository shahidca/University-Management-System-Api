import type { LoginSchemaInput, RegisterSchemaInput } from "./auth.validation.js";
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
//# sourceMappingURL=auth.service.d.ts.map