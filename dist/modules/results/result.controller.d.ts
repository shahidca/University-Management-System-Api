import type { Request, Response } from "express";
export declare const createResultController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getResultsController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getResultByIdController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateResultController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const submitResultController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveResultController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const publishResultController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMySemesterGpaController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyCgpaController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=result.controller.d.ts.map