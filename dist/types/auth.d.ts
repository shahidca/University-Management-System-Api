import type { Role } from "@prisma/client";
export interface AuthenticatedUser {
    userId: string;
    role: Role;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
//# sourceMappingURL=auth.d.ts.map