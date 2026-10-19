import type { Product } from "@/features/products/products.types";

export const cn = (...classes: (string | false | null | undefined)[]): string =>
    classes.filter(Boolean).join(" ");

/** Formats an amount as Indian Rupees, e.g. ₹1,49,999. */
export const formatINR = (amount: number): string =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

/** Percentage off between list price and discounted price (0 when none). */
export const discountPercent = (product: Pick<Product, "price" | "discountPrice">): number => {
    if (!product.discountPrice || product.discountPrice >= product.price || product.price <= 0) return 0;
    return Math.round((1 - product.discountPrice / product.price) * 100);
};

/** The price a buyer actually pays for this product. */
export const finalPrice = (product: Pick<Product, "price" | "discountPrice">): number =>
    product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

export const formatDate = (value: string | Date): string => {
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const timeAgo = (value: string | Date): string => {
    const date = typeof value === "string" ? new Date(value) : value;
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (!Number.isFinite(seconds) || seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(date);
};

export interface StatusMeta {
    label: string;
    className: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 ring-amber-200",
    confirmed: "bg-sky-100 text-sky-800 ring-sky-200",
    processing: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    shipped: "bg-violet-100 text-violet-800 ring-violet-200",
    delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
    paid: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    failed: "bg-rose-100 text-rose-800 ring-rose-200",
    refunded: "bg-slate-100 text-slate-700 ring-slate-200",
    cod: "bg-slate-100 text-slate-700 ring-slate-200",
    razorpay: "bg-sky-100 text-sky-800 ring-sky-200",
};

/** Pill styling + label for order / payment status chips. */
export const statusMeta = (status: string): StatusMeta => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-200",
});
