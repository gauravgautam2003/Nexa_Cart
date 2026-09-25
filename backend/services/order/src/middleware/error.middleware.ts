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
    console.error("Order Service Error:", error);

    const message =
        error instanceof Error
            ? error.message
            : "Internal server error";

    let statusCode = 500;

    if (
        message === "Invalid user ID" ||
        message === "Invalid order ID" ||
        message === "Invalid product ID" ||
        message ===
            "Quantity must be greater than zero" ||
        message === "Price cannot be negative" ||
        message ===
            "Shipping fee cannot be negative" ||
        message === "Discount cannot be negative" ||
        message === "Invalid order total"
    ) {
        statusCode = 400;
    } else if (
        message === "Order not found"
    ) {
        statusCode = 404;
    } else if (
        message === "Delivered order cannot be updated" ||
        message === "Cancelled order cannot be updated" ||
        message ===
            "Order cannot be cancelled at this stage" ||
        message === "Order is already cancelled"
    ) {
        statusCode = 409;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};