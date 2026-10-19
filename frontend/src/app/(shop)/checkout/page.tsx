"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, MapPin, ShieldCheck, ShoppingCart, Truck, Wallet } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCartThunk, fetchCartThunk } from "@/redux/slices/cartSlice";
import { createOrder } from "@/features/orders/orders.api";
import type { ShippingAddress } from "@/features/orders/orders.types";
import {
    createPaymentOrder,
    getPaymentConfig,
    verifyPayment,
} from "@/features/payments/payments.api";
import { getErrorMessage } from "@/services/api";
import { formatINR } from "@/lib/helpers";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
import { EmptyState, Spinner } from "@/components/ui/Feedback";

const addressSchema = z.object({
    fullName: z.string().min(2, "Enter the full name"),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    addressLine1: z.string().min(6, "Enter the house/street address"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "Enter the city"),
    state: z.string().min(2, "Enter the state"),
    postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type AddressForm = z.infer<typeof addressSchema>;

const inputClass = (invalid: boolean) => `input ${invalid ? "input-error" : ""}`;

export default function CheckoutPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector((state) => state.auth.user);
    const authHydrated = useAppSelector((state) => state.auth.hydrated);
    const cart = useAppSelector((state) => state.cart);

    const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
    const [razorpayEnabled, setRazorpayEnabled] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: user?.name ?? "",
            city: "",
            state: "",
            postalCode: "",
        },
    });

    useEffect(() => {
        if (user && cart.status === "idle") {
            void dispatch(fetchCartThunk());
        }
    }, [user, cart.status, dispatch]);

    useEffect(() => {
        getPaymentConfig()
            .then((config) => setRazorpayEnabled(Boolean(config.razorpayEnabled)))
            .catch(() => setRazorpayEnabled(false));
    }, []);

    const shipping = useMemo(
        () => (cart.subtotal >= FREE_SHIPPING_THRESHOLD || cart.subtotal === 0 ? 0 : SHIPPING_FEE),
        [cart.subtotal],
    );
    const total = cart.subtotal + shipping;

    const openRazorpay = (
        keyId: string,
        orderId: string,
        razorpayOrderId: string,
        amountInPaise: number,
        orderDbId: string,
    ): void => {
        const options = {
            key: keyId,
            order_id: razorpayOrderId,
            amount: amountInPaise,
            currency: "INR",
            name: "NexaCart",
            description: `Order ${orderId}`,
            prefill: {
                name: user?.name ?? "",
                email: user?.email ?? "",
            },
            theme: { color: "#0d766e" },
            handler: async (response: {
                razorpay_order_id: string;
                razorpay_payment_id: string;
                razorpay_signature: string;
            }) => {
                try {
                    await verifyPayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    });
                    await dispatch(clearCartThunk());
                    router.push(`/orders/${orderDbId}?paid=1`);
                } catch (error) {
                    setSubmitting(false);
                    setFormError(getErrorMessage(error, "Payment verification failed."));
                }
            },
            modal: {
                ondismiss: () => {
                    setSubmitting(false);
                    setFormError(
                        "Payment window closed. Your order is saved — complete it from My Orders.",
                    );
                },
            },
        };

        const RazorpayCtor = (window as unknown as { Razorpay?: new (o: unknown) => { open: () => void } })
            .Razorpay;

        if (!RazorpayCtor) {
            setSubmitting(false);
            setFormError("Could not load the Razorpay checkout. Try cash on delivery.");
            return;
        }

        new RazorpayCtor(options).open();
    };

    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (document.getElementById("razorpay-checkout")) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.id = "razorpay-checkout";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const onSubmit = async (address: AddressForm) => {
        if (cart.items.length === 0) return;

        setFormError(null);
        setSubmitting(true);

        try {
            const order = await createOrder({
                items: cart.items.map((item) => ({
                    productId: item.productId,
                    sku: item.sku,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    ...address,
                    country: "India",
                } as ShippingAddress,
                shippingFee: shipping,
                discount: 0,
                paymentMethod,
            });

            if (paymentMethod === "cod") {
                await dispatch(clearCartThunk());
                router.push(`/orders/${order.id}?cod=1`);
                return;
            }

            // Razorpay: create the gateway order, then open checkout.
            const config = await getPaymentConfig();
            if (!config.razorpayEnabled || !config.keyId) {
                setFormError("Online payments are not configured yet. Please choose cash on delivery.");
                return;
            }

            const payment = await createPaymentOrder(order.id, order.totalAmount);
            const loaded = await loadRazorpayScript();

            if (!loaded) {
                setFormError("Could not load Razorpay. Please try cash on delivery.");
                return;
            }

            openRazorpay(
                config.keyId,
                order.id,
                payment.razorpayOrder.id,
                payment.razorpayOrder.amount,
                order.id,
            );
        } catch (error) {
            setSubmitting(false);
            setFormError(getErrorMessage(error, "Could not place the order."));
        }
    };

    if (authHydrated && !user) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<Truck size={40} />}
                    title="Sign in to check out"
                    subtitle="You need an account so we can track your order."
                    action={
                        <Link href="/login?next=/checkout" className="btn btn-primary">
                            Sign in
                        </Link>
                    }
                />
            </div>
        );
    }

    if (cart.status !== "loading" && cart.items.length === 0) {
        return (
            <div className="page-shell py-16">
                <EmptyState
                    icon={<ShoppingCart size={40} />}
                    title="Nothing to check out"
                    subtitle="Your cart is empty."
                    action={
                        <Link href="/products" className="btn btn-primary">
                            Browse products
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="page-shell py-6 sm:py-8">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Checkout</h1>
                <p className="text-sm text-gray-500">
                    {cart.totalItems} items · secure order through the NexaCart gateway
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-6 lg:grid-cols-[1fr_360px]"
            >
                <div className="space-y-6">
                    {/* Address */}
                    <section className="card p-5 sm:p-6">
                        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                            <MapPin size={17} className="text-brand" /> Delivery address
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="label" htmlFor="fullName">
                                    Full name
                                </label>
                                <input
                                    id="fullName"
                                    className={inputClass(Boolean(errors.fullName))}
                                    {...register("fullName")}
                                />
                                {errors.fullName && (
                                    <p className="field-error">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="phone">
                                    Mobile number
                                </label>
                                <input
                                    id="phone"
                                    inputMode="numeric"
                                    placeholder="98XXXXXXXX"
                                    className={inputClass(Boolean(errors.phone))}
                                    {...register("phone")}
                                />
                                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="addressLine1">
                                    House no., street, area
                                </label>
                                <input
                                    id="addressLine1"
                                    className={inputClass(Boolean(errors.addressLine1))}
                                    {...register("addressLine1")}
                                />
                                {errors.addressLine1 && (
                                    <p className="field-error">{errors.addressLine1.message}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="addressLine2">
                                    Landmark (optional)
                                </label>
                                <input id="addressLine2" className="input" {...register("addressLine2")} />
                            </div>

                            <div>
                                <label className="label" htmlFor="city">
                                    City
                                </label>
                                <input id="city" className={inputClass(Boolean(errors.city))} {...register("city")} />
                                {errors.city && <p className="field-error">{errors.city.message}</p>}
                            </div>

                            <div>
                                <label className="label" htmlFor="state">
                                    State
                                </label>
                                <input
                                    id="state"
                                    className={inputClass(Boolean(errors.state))}
                                    {...register("state")}
                                />
                                {errors.state && <p className="field-error">{errors.state.message}</p>}
                            </div>

                            <div>
                                <label className="label" htmlFor="postalCode">
                                    PIN code
                                </label>
                                <input
                                    id="postalCode"
                                    inputMode="numeric"
                                    className={inputClass(Boolean(errors.postalCode))}
                                    {...register("postalCode")}
                                />
                                {errors.postalCode && (
                                    <p className="field-error">{errors.postalCode.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="card p-5 sm:p-6">
                        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                            <Wallet size={17} className="text-brand" /> Payment method
                        </h2>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("cod")}
                                className={`rounded-2xl border-2 p-4 text-left transition ${
                                    paymentMethod === "cod"
                                        ? "border-brand bg-brand-soft"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <Truck size={16} /> Cash on delivery
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    Pay when the order reaches you.
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod("razorpay")}
                                disabled={!razorpayEnabled}
                                className={`rounded-2xl border-2 p-4 text-left transition disabled:opacity-50 ${
                                    paymentMethod === "razorpay"
                                        ? "border-brand bg-brand-soft"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <CreditCard size={16} /> UPI / Card / Netbanking
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    {razorpayEnabled
                                        ? "Powered by Razorpay, verified server-side."
                                        : "Add RAZORPAY keys to the payment service to enable."}
                                </span>
                            </button>
                        </div>

                        <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                            <ShieldCheck size={13} className="text-brand" />
                            Payment signatures are verified by the payment service before your
                            order is confirmed.
                        </p>
                    </section>
                </div>

                {/* Summary */}
                <aside>
                    <div className="card sticky top-40 p-5">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                            Order summary
                        </h2>

                        <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                            {cart.items.map((item) => (
                                <li key={item.productId} className="flex items-center gap-3">
                                    <span className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-gray-100">
                                        {item.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="flex h-full items-center justify-center text-xs font-black text-gray-300">
                                                {item.name.charAt(0)}
                                            </span>
                                        )}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="clamp-2 block text-xs font-medium text-gray-700">
                                            {item.name}
                                        </span>
                                        <span className="text-[11px] text-gray-400">× {item.quantity}</span>
                                    </span>
                                    <span className="text-xs font-semibold text-gray-900">
                                        {formatINR(item.itemTotal)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <dt>Subtotal</dt>
                                <dd className="font-semibold text-gray-900">{formatINR(cart.subtotal)}</dd>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <dt>Shipping</dt>
                                <dd className={shipping === 0 ? "font-semibold text-emerald-600" : "font-semibold text-gray-900"}>
                                    {shipping === 0 ? "FREE" : formatINR(shipping)}
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2.5">
                                <dt className="font-bold text-gray-900">Total</dt>
                                <dd className="font-bold text-gray-900">{formatINR(total)}</dd>
                            </div>
                        </dl>

                        {formError && (
                            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-100">
                                {formError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || cart.items.length === 0}
                            className="btn btn-primary btn-lg btn-block mt-4"
                        >
                            {submitting ? (
                                <>
                                    <Spinner /> Placing order…
                                </>
                            ) : paymentMethod === "cod" ? (
                                <>Place order · {formatINR(total)}</>
                            ) : (
                                <>Pay {formatINR(total)}</>
                            )}
                        </button>

                        <p className="mt-3 text-center text-[11px] text-gray-400">
                            Stock is reserved for you the moment the order is created.
                        </p>
                    </div>
                </aside>
            </form>
        </div>
    );
}
