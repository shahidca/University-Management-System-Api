import type { Response } from "express";
export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}
export declare const sendSuccess: <T>(res: Response, statusCode: number, message: string, data: T) => Response<any, Record<string, any>>;
//# sourceMappingURL=api-response.d.ts.map