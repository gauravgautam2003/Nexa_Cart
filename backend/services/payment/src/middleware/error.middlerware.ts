import type {
    Request,
    Response,
    NextFunction,
} from "express";

export const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(
        "Payment Service Error:",
        error
    );

    const message =
        error instanceof Error
            ? error.message
            : "Internal server error";

    let statusCode = 500;

    if (
        message === "Invalid user ID" ||
        message === "Invalid order ID" ||
        message ===
            "Payment amount must be greater than zero"
    ) {
        statusCode = 400;
    } else if (
        message === "Payment not found" ||
        message === "Payment record not found"
    ) {
        statusCode = 404;
    } else if (
        message === "Invalid payment signature"
    ) {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};