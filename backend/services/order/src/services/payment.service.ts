import axios from "axios";

const orderClient = axios.create({
    baseURL: process.env.ORDER_SERVICE_URL ?? "http://localhost:5005",
    timeout: 5000,
});

export const notifyOrderPaymentVerified = async (orderId: string, userId: string) => {
    const { data } = await orderClient.post(`/api/orders/${orderId}/confirm-inventory`, {
        userId
    });

    return data;
};