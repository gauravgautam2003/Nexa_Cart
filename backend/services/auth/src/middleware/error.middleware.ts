import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = async (error: unknown, _req: Request, res: Response, _next: NextFunction): Promise<void> => {

    console.error("Auth Service Error:", error);

    const message =
        error instanceof Error ? error.message : "Internal server error";

    let statusCode = 500;

    if (message === "Email already exists" || message === "User profile already exists") {
        statusCode = 409;
    } else if (
        message === "Invalid email or password" ||
        message === "Invalid or expired refresh token" ||
        message === "Refresh token is required" ||
        message === "Invalid or expired access token" ||
        message === "Invalid access token"
    ) {
        statusCode = 401;
    } else if (message === "User not found" || message === "User profile not found") {
        statusCode = 404;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}