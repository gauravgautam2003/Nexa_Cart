import type { NotificationChannel } from "../models/notification.model.js";

export interface CreateNotificationRequest {
    userId: string;
    title: string;
    message: string;
    channel: NotificationChannel;
    metadata?: Record<string, unknown>;
}

export interface NotificationResponse {
    id: string;
    userId: string;
    title: string;
    message: string;
    channel: NotificationChannel;
    status: "pending" | "sent" | "failed";
    isRead: boolean;
    metadata?: Record<string, unknown>;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}