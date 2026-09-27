import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("Notification Service Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    let statusCode = 500;

    if (message === "Invalid user ID" || message === "Invalid notification ID" || message === "Invalid parameters" || message === "Notification title is required" || message === "Notification message is required" || message === "Invalid notification status") {
        statusCode = 400;
    }

    if (message === "Notification not found") {
        statusCode = 404;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};