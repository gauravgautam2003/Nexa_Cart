import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("Inventory Service Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    let statusCode = 500;

    if (message === "Inventory already exists for this product" || message === "SKU already exists") {
        statusCode = 409;
    }
    else if (message === "Inventory not found" || message === "Insufficient stock or inventory not found") {
        statusCode = 404;
    }
    else if (message === "Quantity must be greater than zero") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};
