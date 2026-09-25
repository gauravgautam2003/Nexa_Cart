import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    createPaymentOrder,
    verifyPayment,
    getPaymentByOrderId,
} from "../services/payment.service.js";

export const createOrder = async (
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

        const result = await createPaymentOrder(
            userId,
            req.body
        );

        res.status(201).json({
            success: true,
            message:
                "Razorpay order created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const verify = async (
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

        const payment = await verifyPayment(
            userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

export const getByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { orderId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (
            !orderId ||
            Array.isArray(orderId)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }

        const payment =
            await getPaymentByOrderId(
                userId,
                orderId
            );

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};