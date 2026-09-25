import type { Request, Response, NextFunction } from "express";
import { createOrder, getOrderById, getUserOrders, updateOrderStatus, cancelOrder,} from "../services/order.service.js";

export const create = async ( req: Request, res: Response, next: NextFunction): Promise<void> => {
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