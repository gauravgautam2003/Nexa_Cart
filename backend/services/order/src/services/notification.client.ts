import axios from "axios";

const notificationClient = axios.create({
    baseURL: process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:5008",
    timeout: 5000,
});

export interface OrderNotificationInput {
    userId: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
}

/**
 * Best-effort notification dispatch: a notification outage must never
 * break the order flow, so failures are logged and swallowed.
 */
export const sendOrderNotification = async (input: OrderNotificationInput): Promise<void> => {
    try {
        await notificationClient.post("/", {
            userId: input.userId,
            title: input.title,
            message: input.message,
            channel: "email",
            ...(input.metadata !== undefined && { metadata: input.metadata }),
        });
    } catch (error) {
        console.error("Notification dispatch failed:", {
            title: input.title,
            error: error instanceof Error ? error.message : error,
        });
    }
};
