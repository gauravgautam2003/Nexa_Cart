import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = ( error: unknown, _req: Request, res: Response, _next: NextFunction): void => {

    console.error("API Gateway Error:", error);
    res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Gateway internal server error",
    });
};