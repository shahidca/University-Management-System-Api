import type { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refresh: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const resendVerification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const forgotPasswordController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const resetPasswordController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const googleLoginController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map