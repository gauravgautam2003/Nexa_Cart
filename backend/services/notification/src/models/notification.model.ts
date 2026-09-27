import mongoose, { Document, Schema } from "mongoose";

export type NotificationChannel = | "email" | "sms" | "push";
export type NotificationStatus = | "pending" | "sent" | "failed";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    isRead: boolean;
    metadata?: Record<string, unknown>;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },

    channel: {
        type: String,
        enum: ["email", "sms", "push"],
        required: true,
        index: true,
    },

    status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
        index: true,
    },

    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },

    metadata: {
        type: Schema.Types.Mixed,
    },

    sentAt: {
        type: Date,
    },
},
    {
        timestamps: true,
    }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;