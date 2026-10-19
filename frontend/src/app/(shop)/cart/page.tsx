"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchCartThunk,
    removeItemThunk,
    updateQuantityThunk,
} from "@/redux/slices/cartSlice";
import { formatINR } from "@/lib/helpers";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { EmptyState, Spinner } from "@/components/ui/Feedback";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector((state) => state.auth.user);
    const authHydrated = useAppSelector((state) => state.auth.hydrated);
    const { items, subtotal, totalItems, status, error } = useAppSelector((state) => state.cart);

    useEffect(() => {
        if (user && status === "idle") {
            void dispatch(fetchCartThunk());
        }
    }, [user, status, dispatch]);

    if (authHydrated && !user) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<ShoppingCart size={40} />}
                    title="Sign in to see your cart"
                    subtitle="Your cart is stored per account so it follows you across devices."
                    action={
                        <Link href="/login?next=/cart" className="btn btn-primary">
                            Sign in
                        </Link>
                    }
                />
            </div>
        );
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    return (
        <div className="page-shell py-6 sm:py-8">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your cart</h1>
                <p className="text-sm text-gray-500">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
            </div>

            {status === "loading" && (
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-3">
                        {[0, 1].map((i) => (
                            <div key={i} className="skeleton h-28" />
                        ))}
                    </div>
                    <div className="skeleton h-64" />
                </div>
            )}

            {status !== "loading" && items.length === 0 && (
                <EmptyState
                    icon={<ShoppingCart size={40} />}
                    title="Your cart is empty"
                    subtitle="Add something you love — every listing is already agent-verified."
                    action={
                        <Link href="/products" className="btn btn-primary">
                            Start shopping <ArrowRight size={15} />
                        </Link>
                    }
                />
            )}

            {status !== "loading" && items.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    {/* Items */}
                    <div className="space-y-3">
                        {error && (
                            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                                {error}
                            </div>
                        )}

                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="card flex items-center gap-4 p-3.5 sm:p-4"
                            >
                                <Link
                                    href={`/products/${item.productId}`}
                                    className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24"
                                >
                                    {item.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-full items-center justify-center text-2xl font-black text-gray-300">
                                            {item.name.charAt(0)}
                                        </span>
                                    )}
                                </Link>

                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/products/${item.productId}`}
                                        className="clamp-2 text-sm font-semibold text-gray-900 hover:text-brand"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="mt-0.5 text-xs text-gray-400">{item.sku}</p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        {formatINR(item.price)}
                </p>

                                    <div className="mt-2 flex items-center gap-3">
                                        <QuantityStepper
                                            size="sm"
                                            value={item.quantity}
                                            max={10}
                                            onChange={(quantity) =>
                                                void dispatch(
                                                    updateQuantityThunk({
                                                        productId: item.productId,
                                                        quantity,
                                                    }),
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void dispatch(removeItemThunk(item.productId))}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:underline"
                                        >
                                            <Trash2 size={13} /> Remove
                                        </button>
                                    </div>
                                </div>

                                <p className="hidden flex-none text-right text-sm font-bold text-gray-900 sm:block">
                                    {formatINR(item.itemTotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <aside>
                        <div className="card sticky top-40 p-5">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                                Order summary
                            </h2>

                            <dl className="mt-4 space-y-2.5 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <dt>Subtotal</dt>
                                    <dd className="font-semibold text-gray-900">{formatINR(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <dt>Shipping</dt>
                                    <dd className={shipping === 0 ? "font-semibold text-emerald-600" : "font-semibold text-gray-900"}>
                                        {shipping === 0 ? "FREE" : formatINR(shipping)}
                                    </dd>
                                </div>
                                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                                    <dt className="font-bold text-gray-900">Total</dt>
                                    <dd className="font-bold text-gray-900">{formatINR(total)}</dd>
                                </div>
                            </dl>

                            {shipping > 0 && (
                                <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-xs text-brand">
                                    Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
                                    delivery.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => router.push("/checkout")}
                                className="btn btn-primary btn-lg btn-block mt-4"
                            >
                                Proceed to checkout <ArrowRight size={16} />
                            </button>

                            <Link
                                href="/products"
                                className="btn btn-ghost btn-block mt-2"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
