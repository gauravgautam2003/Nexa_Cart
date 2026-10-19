"use client";

import { useCallback, useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { listOrders, updateOrderStatus } from "@/features/orders/orders.api";
import type { Order, OrderStatus } from "@/features/orders/orders.types";
import { getErrorMessage } from "@/services/api";
import { formatDate, formatINR, statusMeta } from "@/lib/helpers";
import { EmptyState, Spinner } from "@/components/ui/Feedback";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const load = useCallback(() => {
        listOrders()
            .then((items) => {
                setOrders(items);
                setError(null);
            })
            .catch((err: unknown) => setError(getErrorMessage(err, "Could not load orders.")))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const changeStatus = async (order: Order, status: OrderStatus) => {
        setUpdatingId(order.id);
        try {
            const updated = await updateOrderStatus(order.id, status);
            setOrders((items) => items.map((item) => (item.id === updated.id ? updated : item)));
        } catch (err) {
            setError(getErrorMessage(err, "Could not update the order."));
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
                <Spinner /> Loading orders…
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500">
                    {orders.length} orders across the store · advance them through fulfilment.
                </p>
            </div>

            {error && (
                <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                    {error}
                </p>
            )}

            {orders.length === 0 && !loading && (
                <EmptyState
                    icon={<Receipt size={40} />}
                    title="No orders yet"
                    subtitle="Orders placed on the storefront will appear here in real time."
                />
            )}

            {orders.length > 0 && (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const chip = statusMeta(order.orderStatus);
                        const paymentChip = statusMeta(order.paymentStatus);

                        return (
                            <div key={order.id} className="card p-4 sm:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.createdAt)} · {order.items.length} items ·{" "}
                                            {order.shippingAddress.fullName} · {order.shippingAddress.city}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`chip ${chip.className}`}>{chip.label}</span>
                                        <span className={`chip ${paymentChip.className}`}>
                                            {paymentChip.label}
                                        </span>
                                        <span className="text-base font-black text-gray-900">
                                            {formatINR(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                                    <span className="text-xs font-semibold text-gray-400">Advance to</span>
                                    {STATUSES.map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            disabled={updatingId === order.id || status === order.orderStatus}
                                            onClick={() => void changeStatus(order, status)}
                                            className={`btn btn-sm ${
                                                status === order.orderStatus
                                                    ? "btn-primary"
                                                    : "btn-ghost"
                                            }`}
                                        >
                                            {statusMeta(status).label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
