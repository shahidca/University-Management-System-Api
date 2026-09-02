import type { Role } from "@prisma/client";
export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}
//# sourceMappingURL=auth.types.d.ts.map