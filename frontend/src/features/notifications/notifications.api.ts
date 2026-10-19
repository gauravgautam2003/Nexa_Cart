import { api, compactParams } from "@/services/api";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    channel: "email" | "sms" | "push";
    status: "pending" | "sent" | "failed";
    isRead: boolean;
    createdAt: string;
}

/** The current user's notifications, newest first. */
export const listNotifications = async (userId: string): Promise<Notification[]> => {
    const { data } = await api.get<{ success: boolean; notifications?: Notification[]; data?: Notification[] }>(
        `/notifications/user/${userId}`,
        { params: compactParams({ limit: 12 }) },
    );
    return data.notifications ?? data.data ?? [];
};

export const markNotificationRead = async (userId: string, notificationId: string): Promise<void> => {
    await api.patch(`/notifications/user/${userId}/${notificationId}/read`);
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
    await api.patch(`/notifications/user/${userId}/read-all`);
};
