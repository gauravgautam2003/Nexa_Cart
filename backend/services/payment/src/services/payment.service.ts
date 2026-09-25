import crypto from "crypto";
import mongoose from "mongoose";

import Payment from "../models/payment.model.js";
import razorpay from "../config/razorpay.js";

import type {
    CreatePaymentOrderRequest,
    VerifyPaymentRequest,
    PaymentResponse,
} from "../types/payment.type.js";

const createPaymentResponse = (
    payment: InstanceType<typeof Payment>
): PaymentResponse => ({
    id: payment._id.toString(),

    orderId: payment.orderId.toString(),

    userId: payment.userId.toString(),

    razorpayOrderId: payment.razorpayOrderId,

    ...(payment.razorpayPaymentId !== undefined && {
        razorpayPaymentId:
            payment.razorpayPaymentId,
    }),

    amount: payment.amount,

    currency: payment.currency,

    status: payment.status,

    createdAt: payment.createdAt,

    updatedAt: payment.updatedAt,
});

export const createPaymentOrder = async (
    userId: string,
    data: CreatePaymentOrderRequest
): Promise<{
    payment: PaymentResponse;
    razorpayOrder: {
        id: string;
        amount: number;
        currency: string;
    };
}> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    if (!mongoose.isValidObjectId(data.orderId)) {
        throw new Error("Invalid order ID");
    }

    // Convert string | number → number
    const amount = Number(data.amount);

    // Validate normalized amount
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Amount must be a valid positive number");
    }

    const currency = data.currency ?? "INR";

    // Razorpay expects amount in paise
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: data.orderId,
    });

    const payment = await Payment.create({
        orderId: new mongoose.Types.ObjectId(data.orderId),
        userId: new mongoose.Types.ObjectId(userId),

        razorpayOrderId: razorpayOrder.id,

        // IMPORTANT: use normalized number
        amount,

        currency,

        status: "created",
    });

    return {
        payment: createPaymentResponse(payment),

        razorpayOrder: {
            id: razorpayOrder.id,
            amount: Number(razorpayOrder.amount),
            currency: razorpayOrder.currency,
        }    
    };
};

export const verifyPayment = async (
    userId: string,
    data: VerifyPaymentRequest
): Promise<PaymentResponse> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const payment = await Payment.findOne({
        userId,
        razorpayOrderId: data.razorpayOrderId,
    });

    if (!payment) {
        throw new Error("Payment record not found");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
        throw new Error(
            "RAZORPAY_KEY_SECRET is not defined"
        );
    }

    const generatedSignature =
        crypto
            .createHmac("sha256", secret)
            .update(
                `${data.razorpayOrderId}|${data.razorpayPaymentId}`
            )
            .digest("hex");

    const isValid =
        generatedSignature ===
        data.razorpaySignature;

    if (!isValid) {
        payment.status = "failed";

        await payment.save();

        throw new Error(
            "Invalid payment signature"
        );
    }

    payment.razorpayPaymentId =
        data.razorpayPaymentId;

    payment.razorpaySignature =
        data.razorpaySignature;

    payment.status = "paid";

    await payment.save();

    return createPaymentResponse(payment);
};

export const getPaymentByOrderId = async (
    userId: string,
    orderId: string
): Promise<PaymentResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const payment = await Payment.findOne({
        userId,
        orderId,
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    return createPaymentResponse(payment);
};