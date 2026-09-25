import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
    orderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    amount: number;
    currency: string;

    status: | "created" | "paid" | "failed" | "refunded";
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        razorpayPaymentId: {
            type: String,
            unique: true,
            sparse: true,
        },

        razorpaySignature: {
            type: String,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            required: true,
            default: "INR",
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({
    userId: 1,
    createdAt: -1,
});

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;