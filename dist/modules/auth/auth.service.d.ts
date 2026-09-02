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
export declare const loginUser: (_input: LoginSchemaInput) => Promise<never>;
//# sourceMappingURL=auth.service.d.ts.map