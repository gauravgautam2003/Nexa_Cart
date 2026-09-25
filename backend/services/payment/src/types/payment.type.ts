export interface CreatePaymentOrderRequest {
    orderId: string;
    amount: number;
    currency?: string;
}

export interface VerifyPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface PaymentResponse {
    id: string;
    orderId: string;
    userId: string;

    razorpayOrderId: string;
    razorpayPaymentId?: string;

    amount: number;
    currency: string;

    status: string;

    createdAt: Date;
    updatedAt: Date;
}