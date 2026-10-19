"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, PackageOpen, Receipt } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { listOrders } from "@/features/orders/orders.api";
import type { Order } from "@/features/orders/orders.types";
import { formatDate, formatINR, statusMeta } from "@/lib/helpers";
import { EmptyState, Spinner } from "@/components/ui/Feedback";

const ORDER_FLOW: Order["orderStatus"][] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function StatusStepper({ order }: { order: Order }) {
    if (order.orderStatus === "cancelled") {
        return (
            <p className="chip bg-rose-100 text-rose-700 ring-rose-200">
                {statusMeta("cancelled").label}
            </p>
        );
    }

    const currentIndex = ORDER_FLOW.indexOf(order.orderStatus);

    return (
        <ol className="flex items-center gap-1" aria-label={`Order status: ${order.orderStatus}`}>
            {ORDER_FLOW.map((step, index) => {
                const done = index <= currentIndex;
                return (
                    <li key={step} className="flex flex-1 flex-col items-center gap-1">
                        <span
                            className={`h-1.5 w-full rounded-full ${done ? "bg-brand" : "bg-gray-200"}`}
                        />
                        <span
                            className={`text-[9px] font-semibold uppercase tracking-wide ${
                                index === currentIndex ? "text-brand" : "text-gray-400"
                            }`}
                        >
                            {step}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default function OrdersPage() {
    const user = useAppSelector((state) => state.auth.user);
    const authHydrated = useAppSelector((state) => state.auth.hydrated);

    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        if (!user) return;
        listOrders()
            .then((items) => {
                setOrders(items);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
    }, [user]);

    if (authHydrated && !user) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<Receipt size={40} />}
                    title="Sign in to view your orders"
                    action={
                        <Link href="/login?next=/orders" className="btn btn-primary">
                            Sign in
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
            <div className="page-shell py-6 sm:py-8">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My orders</h1>
                <p className="text-sm text-gray-500">Track, pay and cancel — all in one place.</p>
            </div>

            {status === "loading" && (
                <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
                    <Spinner /> Loading your orders…
                </div>
            )}

            {status === "error" && (
                <EmptyState
                    icon={<PackageOpen size={40} />}
                    title="Could not load orders"
                    subtitle="Please try again in a moment."
                />
            )}

            {status === "ready" && orders.length === 0 && (
                <EmptyState
                    icon={<Package size={40} />}
                    title="No orders yet"
                    subtitle="When you place an order it will show up here with live tracking."
                    action={
                        <Link href="/products" className="btn btn-primary">
                            Start shopping
                        </Link>
                    }
                />
            )}

            {status === "ready" && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const orderChip = statusMeta(order.orderStatus);
                        const paymentChip = statusMeta(order.paymentStatus);

                        return (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`chip ${orderChip.className}`}>{orderChip.label}</span>
                                        <span className={`chip ${paymentChip.className}`}>{paymentChip.label}</span>
                                        <span className="chip bg-gray-100 text-gray-600 ring-gray-200">
                                            {order.paymentMethod === "cod" ? "COD" : "Razorpay"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-3 overflow-hidden">
                                    {order.items.slice(0, 4).map((item, index) => (
                                        <span
                                            key={`${item.productId}-${index}`}
                                            className="h-12 w-12 flex-none overflow-hidden rounded-lg bg-gray-100"
                                        >
                                            {item.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="flex h-full items-center justify-center text-sm font-black text-gray-300">
                                                    {item.name.charAt(0)}
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                    <span className="min-w-0 text-sm text-gray-600">
                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                        {order.items[0] && <> · {order.items[0].name}</>}
                                        {order.items.length > 1 && " …"}
                                    </span>
                                    <span className="ml-auto whitespace-nowrap text-base font-bold text-gray-900">
                                        {formatINR(order.totalAmount)}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <StatusStepper order={order} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
