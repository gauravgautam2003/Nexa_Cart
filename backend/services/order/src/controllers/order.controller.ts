import type { Request, Response, NextFunction } from "express";
import {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    cancelOrder,
    confirmOrderInventory,
    updatePaymentStatus,
} from "../services/order.service.js";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const order = await createOrder(
            userId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const orders = await getUserOrders(userId);

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (!id || Array.isArray(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await getOrderById(
            userId,
            id
        );

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await updateOrderStatus(
            id,
            userId ?? "",
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const cancel = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (!id || Array.isArray(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const order = await cancelOrder(
            userId,
            id
        );

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

interface PaymentStatusBody {
    status?: "pending" | "paid" | "failed" | "refunded";
    paymentId?: string;
    userId?: string;
}

/**
 * Called by the payment service after a Razorpay payment is verified.
 * Marks the order as paid (or failed).
 */
export const updatePaymentStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const body = (req.body ?? {}) as PaymentStatusBody;
        const userId = body.userId ?? req.user?.id;

        if (!id || Array.isArray(id)) {
            res.status(400).json({ success: false, message: "Invalid order ID" });
            return;
        }

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!body.status) {
            res.status(400).json({ success: false, message: "status is required" });
            return;
        }

        const order = await updatePaymentStatus(id, userId, body.status, body.paymentId);

        res.status(200).json({
            success: true,
            message: "Order payment status updated",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Called by the payment service once payment is verified: converts the
 * reserved stock into a completed sale and confirms the order.
 */
export const confirmInventoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const body = (req.body ?? {}) as { userId?: string };
        const userId = body.userId ?? req.user?.id;

        if (!id || Array.isArray(id)) {
            res.status(400).json({ success: false, message: "Invalid order ID" });
            return;
        }

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const order = await confirmOrderInventory(id, userId);

        res.status(200).json({
            success: true,
            message: "Order inventory confirmed",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
