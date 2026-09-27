import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import type { CreateNotificationRequest, NotificationResponse } from "../types/notification.type.js";

const createNotificationResponse = (notification: InstanceType<typeof Notification>): NotificationResponse => ({
    id: notification._id.toString(),
    userId: notification.userId.toString(),
    title: notification.title,
    message: notification.message,
    channel: notification.channel,
    status: notification.status,
    isRead: notification.isRead,

    ...(notification.metadata !== undefined && {
        metadata: notification.metadata,
    }),

    ...(notification.sentAt !== undefined && {
        sentAt: notification.sentAt,
    }),

    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
});

export const createNotification = async (data: CreateNotificationRequest): Promise<NotificationResponse> => {
    if (!mongoose.isValidObjectId(data.userId)) {
        throw new Error("Invalid user ID");
    }

    if (!data.title?.trim()) {
        throw new Error("Notification title is required");
    }

    if (!data.message?.trim()) {
        throw new Error("Notification message is required");
    }

    const notification = await Notification.create({
        userId: new mongoose.Types.ObjectId(data.userId),
        title: data.title,
        message: data.message,
        channel: data.channel,
        ...(data.metadata !== undefined && {
            metadata: data.metadata,
        }),
        status: "pending",
        isRead: false,
    });

    return createNotificationResponse(notification);
};

export const getUserNotifications = async (userId: string): Promise<NotificationResponse[]> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    return notifications.map(createNotificationResponse);
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<NotificationResponse> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    if (!mongoose.isValidObjectId(notificationId)) {
        throw new Error("Invalid notification ID");
    }

    const notification = await Notification.findOne({ _id: new mongoose.Types.ObjectId(notificationId), userId: new mongoose.Types.ObjectId(userId) });

    if (!notification) {
        throw new Error("Notification not found");
    }

    notification.isRead = true;
    await notification.save();

    return createNotificationResponse(notification);
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    await Notification.updateMany({
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false
    },
        {
            $set: {
                isRead: true,
            },
        }
    );
};

export const updateNotificationStatus = async (notificationId: string, status: "pending" | "sent" | "failed"): Promise<NotificationResponse> => {
    if (!mongoose.isValidObjectId(notificationId)) {
        throw new Error("Invalid notification ID");
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new Error("Notification not found");
    }

    notification.status = status;

    if (status === "sent") {
        notification.sentAt = new Date();
    }

    await notification.save();

    return createNotificationResponse(notification);
};