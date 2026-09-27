import type { Request, Response, NextFunction } from "express";
import { createNotification, getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, updateNotificationStatus, } from "../services/notification.service.js";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notification = await createNotification(req.body);

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification,
        });

    } catch (error) {
        next(error);
    }
};

export const getUserNotificationsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {
            throw new Error("Invalid user ID");
        }

        const notifications = await getUserNotifications(userId);

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, notificationId } = req.params;

        if (!userId || Array.isArray(userId) || !notificationId || Array.isArray(notificationId)) {
            throw new Error("Invalid parameters");
        }

        const notification = await markNotificationAsRead(userId, notificationId);

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {
            throw new Error("Invalid user ID");
        }

        await markAllNotificationsAsRead(userId);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { notificationId } = req.params;

        if (!notificationId || Array.isArray(notificationId)) {
            throw new Error("Invalid notification ID");
        }

        const { status } = req.body;

        if (status !== "pending" && status !== "sent" && status !== "failed") {
            throw new Error("Invalid notification status");
        }

        const notification = await updateNotificationStatus(notificationId, status);

        res.status(200).json({
            success: true,
            message: "Notification status updated",
            notification,
        });
    } catch (error) {
        next(error);
    }
};