import { api } from "@/services/api";

export interface PaymentConfig {
    razorpayEnabled: boolean;
    keyId?: string;
}

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

export interface CreatePaymentResponse {
    payment: { id: string; orderId: string; amount: number; currency: string; status: string };
    razorpayOrder: RazorpayOrder;
}

export interface VerifyPaymentInput {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
    const { data } = await api.get<{ success: boolean; data: PaymentConfig }>("/payments/config");
    return data.data;
};

export const createPaymentOrder = async (orderId: string, amount: number): Promise<CreatePaymentResponse> => {
    const { data } = await api.post<{ success: boolean; data: CreatePaymentResponse }>("/payments/create-order", {
        orderId,
        amount,
    });
    return data.data;
};

export const verifyPayment = async (input: VerifyPaymentInput): Promise<{ status: string }> => {
    const { data } = await api.post<{ success: boolean; data: { status: string } }>("/payments/verify", input);
    return data.data;
};
