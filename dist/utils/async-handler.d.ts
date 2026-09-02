import type { NextFunction, Request, RequestHandler, Response } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (handler: AsyncRequestHandler) => RequestHandler;
export {};
//# sourceMappingURL=async-handler.d.ts.map