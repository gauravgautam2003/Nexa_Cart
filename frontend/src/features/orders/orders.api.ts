import { api } from "@/services/api";
import type { CreateOrderInput, Order, OrderStatus } from "./orders.types";

interface OrderEnvelope {
    success: boolean;
    message?: string;
    data?: Order;
}

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
    const { data } = await api.post<OrderEnvelope>("/orders", input);
    if (!data.data) throw new Error(data.message ?? "Order could not be created");
    return data.data;
};

export const listOrders = async (): Promise<Order[]> => {
    const { data } = await api.get<{ success: boolean; data?: Order[] }>("/orders");
    return data.data ?? [];
};

export const getOrder = async (id: string): Promise<Order> => {
    const { data } = await api.get<OrderEnvelope>(`/orders/${id}`);
    if (!data.data) throw new Error("Order not found");
    return data.data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
    const { data } = await api.patch<OrderEnvelope>(`/orders/${id}/cancel`);
    if (!data.data) throw new Error(data.message ?? "Order could not be cancelled");
    return data.data;
};

/** Admin: advance an order through the fulfilment pipeline. */
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch<OrderEnvelope>(`/orders/${id}/status`, { status });
    if (!data.data) throw new Error(data.message ?? "Status could not be updated");
    return data.data;
};
