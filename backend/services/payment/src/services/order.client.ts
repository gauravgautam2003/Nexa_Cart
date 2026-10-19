import axios from "axios";

const orderClient = axios.create({
    baseURL: process.env.ORDER_SERVICE_URL ?? "http://localhost:5005",
    timeout: 5000,
});

/**
 * Tells the order service that a payment was verified: the order becomes
 * paid/confirmed and its reserved stock is converted into a sale.
 * Failures are logged so a notification hiccup never fails the payment.
 */
export const notifyOrderPaymentVerified = async (orderId: string, userId: string): Promise<void> => {
    try {
        await orderClient.patch(
            `/orders/${orderId}/payment-status`,
            { status: "paid", userId },
            { headers: { "x-user-id": userId } },
        );

        await orderClient.post(
            `/orders/${orderId}/confirm-inventory`,
            { userId },
            { headers: { "x-user-id": userId } },
        );
    } catch (error) {
        console.error("Order payment confirmation failed:", {
            orderId,
            error: error instanceof Error ? error.message : error,
        });
    }
};

/** Marks the order payment as failed (signature mismatch). */
export const notifyOrderPaymentFailed = async (orderId: string, userId: string): Promise<void> => {
    try {
        await orderClient.patch(
            `/orders/${orderId}/payment-status`,
            { status: "failed", userId },
            { headers: { "x-user-id": userId } },
        );
    } catch (error) {
        console.error("Order payment failure notification failed:", {
            orderId,
            error: error instanceof Error ? error.message : error,
        });
    }
};
