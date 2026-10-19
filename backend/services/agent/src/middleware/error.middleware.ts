import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("Agent Service Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    let statusCode = 500;

    if (message === "Invalid product ID") {
        statusCode = 400;
    } else if (message === "Product not found" || message === "Verification report not found") {
        statusCode = 404;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};
