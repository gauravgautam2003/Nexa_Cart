"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Ban, CheckCircle2, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { cancelOrder, getOrder } from "@/features/orders/orders.api";
import type { Order } from "@/features/orders/orders.types";
import { formatDate, formatINR, statusMeta } from "@/lib/helpers";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { cn } from "@/lib/helpers";

const FLOW: Order["orderStatus"][] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function SuccessBanner() {
    const searchParams = useSearchParams();
    const paid = searchParams.get("paid");
    const cod = searchParams.get("cod");

    if (!paid && !cod) return null;

    return (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3.5 ring-1 ring-emerald-200">
            <CheckCircle2 size={20} className="mt-0.5 flex-none text-emerald-600" />
            <div>
                <p className="text-sm font-bold text-emerald-800">
                    {paid ? "Payment successful — order confirmed!" : "Order placed successfully!"}
                </p>
                <p className="text-xs text-emerald-700/90">
                    {paid
                        ? "Your payment was verified server-side and stock is locked in."
                        : "You are paying cash on delivery when the order arrives."}
                </p>
            </div>
        </div>
    );
}

function OrderDetailContent({ id }: { id: string }) {
    const user = useAppSelector((state) => state.auth.user);
    const authHydrated = useAppSelector((state) => state.auth.hydrated);

    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!user) return;
        getOrder(id)
            .then((result) => {
                setOrder(result);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
    }, [id, user]);

    const handleCancel = async () => {
        if (!order) return;
        setCancelling(true);
        try {
            const updated = await cancelOrder(order.id);
            setOrder(updated);
        } catch {
            // Keep the button usable; status unchanged.
        } finally {
            setCancelling(false);
        }
    };

    if (authHydrated && !user) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<Truck size={40} />}
                    title="Sign in to view this order"
                    action={
                        <Link href={`/login?next=/orders/${id}`} className="btn btn-primary">
                            Sign in
                        </Link>
                    }
                />
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="page-shell py-10">
                <div className="flex items-center justify-center gap-3 text-gray-500">
                    <Spinner /> Loading order…
                </div>
            </div>
        );
    }

    if (status === "error" || !order) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<Ban size={40} />}
                    title="Order not found"
                    subtitle="It may belong to another account."
                    action={
                        <Link href="/orders" className="btn btn-primary">
                            My orders
                        </Link>
                    }
                />
            </div>
        );
    }

    const currentIndex = FLOW.indexOf(order.orderStatus);
    const canCancel = ["pending", "confirmed"].includes(order.orderStatus);

    return (
        <div className="page-shell py-6 sm:py-8">
            <SuccessBanner />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                        <ArrowLeft size={13} /> All orders
                    </Link>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Order #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-500">Placed {formatDate(order.createdAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={`chip ${statusMeta(order.orderStatus).className}`}>
                        {statusMeta(order.orderStatus).label}
                    </span>
                    <span className={`chip ${statusMeta(order.paymentStatus).className}`}>
                        {statusMeta(order.paymentStatus).label}
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <section className="card p-5 sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                    Fulfilment
                </h2>

                {order.orderStatus === "cancelled" ? (
                    <p className="mt-3 text-sm font-semibold text-rose-600">
                        This order was cancelled.
                    </p>
                ) : (
                    <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                        {FLOW.map((step, index) => {
                            const done = index <= currentIndex;
                            return (
                                <li key={step} className="flex items-center gap-2 sm:block">
                                    <span
                                        className={cn(
                                            "flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold sm:mx-auto",
                                            done ? "bg-brand text-white" : "bg-gray-100 text-gray-400",
                                        )}
                                    >
                                        {done ? <CheckCircle2 size={15} /> : index + 1}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-xs font-semibold sm:mt-1.5 sm:block sm:text-center",
                                            done ? "text-gray-900" : "text-gray-400",
                                        )}
                                    >
                                        {step}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Items */}
                <section className="card p-5 sm:p-6">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                        Items
                    </h2>

                    <ul className="mt-4 divide-y divide-gray-100">
                        {order.items.map((item, index) => (
                            <li
                                key={`${item.productId}-${index}`}
                                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                            >
                                <Link
                                    href={`/products/${item.productId}`}
                                    className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-gray-100"
                                >
                                    {item.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="flex h-full items-center justify-center font-black text-gray-300">
                                            {item.name.charAt(0)}
                                        </span>
                                    )}
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <p className="clamp-2 text-sm font-semibold text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.sku} · qty {item.quantity} · {formatINR(item.price)} each
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">
                                    {formatINR(item.itemTotal)}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <dt>Subtotal</dt>
                            <dd className="font-semibold text-gray-900">{formatINR(order.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <dt>Shipping</dt>
                            <dd className="font-semibold text-gray-900">
                                {order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}
                            </dd>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <dt>Discount</dt>
                                <dd className="font-semibold">− {formatINR(order.discount)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-gray-100 pt-2.5">
                            <dt className="font-bold text-gray-900">Total</dt>
                            <dd className="font-bold text-gray-900">{formatINR(order.totalAmount)}</dd>
                        </div>
                    </dl>
                </section>

                {/* Address + actions */}
                <aside className="space-y-4">
                    <section className="card p-5">
                        <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-gray-400">
                            <Truck size={14} /> Shipping to
                        </h2>
                        <address className="mt-3 text-sm not-italic leading-6 text-gray-600">
                            <span className="font-semibold text-gray-900">
                                {order.shippingAddress.fullName}
                            </span>
                            <br />
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 && (
                                <>
                                    <br />
                                    {order.shippingAddress.addressLine2}
                                </>
                            )}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            {order.shippingAddress.postalCode}
                            <br />
                            📞 {order.shippingAddress.phone}
                        </address>
                    </section>

                    <section className="card p-5">
                        <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-gray-400">
                            <PackageCheck size={14} /> Payment
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {order.paymentMethod === "cod"
                                ? "Cash on delivery"
                                : "Razorpay · "}
                            {order.paymentMethod !== "cod" && (
                                <span className={`chip ml-1 ${statusMeta(order.paymentStatus).className}`}>
                                    {statusMeta(order.paymentStatus).label}
                                </span>
                            )}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <ShieldCheck size={13} className="text-brand" />
                            {order.paymentStatus === "paid"
                                ? "Payment verified by the payment service."
                                : "Stock is reserved until payment completes."}
                        </p>

                        {canCancel && (
                            <button
                                type="button"
                                onClick={() => void handleCancel()}
                                disabled={cancelling}
                                className="btn btn-danger btn-block mt-4"
                            >
                                {cancelling ? <Spinner /> : <Ban size={15} />}
                                Cancel order
                            </button>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <Suspense fallback={<div className="page-shell py-10"><div className="skeleton h-40" /></div>}>
            <OrderDetailContent id={id} />
        </Suspense>
    );
}
