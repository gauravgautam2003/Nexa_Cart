import type { Product } from "@/features/products/products.types";

export const Stars = ({
    rating,
    reviewCount,
    size = "sm",
}: {
    rating: number;
    reviewCount?: number;
    size?: "sm" | "md";
}) => {
    const clamped = Math.max(0, Math.min(5, rating || 0));
    const percent = (clamped / 5) * 100;
    const starClass = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";

    return (
        <span
            className="inline-flex items-center gap-1"
            aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
        >
            <span className="relative inline-block">
                <span className={`flex gap-0.5 text-gray-300`} aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <StarIcon key={i} className={starClass} />
                    ))}
                </span>
                <span
                    className="absolute inset-0 overflow-hidden flex gap-0.5 text-amber-400"
                    style={{ width: `${percent}%` }}
                    aria-hidden
                >
                    {[0, 1, 2, 3, 4].map((i) => (
                        <StarIcon key={i} className={starClass} />
                    ))}
                </span>
            </span>
            <span
                className={`font-semibold text-gray-600 ${size === "sm" ? "text-[11px]" : "text-xs"}`}
            >
                {clamped.toFixed(1)}
            </span>
            {reviewCount !== undefined && (
                <span className={`text-gray-400 ${size === "sm" ? "text-[11px]" : "text-xs"}`}>
                    ({reviewCount})
                </span>
            )}
        </span>
    );
};

const StarIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
            clipRule="evenodd"
        />
    </svg>
);

/** Compact price display: struck MRP, sale price and discount pill. */
export const PriceTag = ({
    product,
    size = "md",
}: {
    product: Pick<Product, "price" | "discountPrice">;
    size?: "sm" | "md" | "lg";
}) => {
    const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
    const paid = hasDiscount ? product.discountPrice! : product.price;
    const off = hasDiscount
        ? Math.round((1 - product.discountPrice! / product.price) * 100)
        : 0;

    const priceClass =
        size === "lg" ? "text-2xl font-bold" : size === "md" ? "text-lg font-bold" : "text-sm font-semibold";
    const mrpClass = size === "lg" ? "text-sm" : "text-xs";

    return (
        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className={`${priceClass} text-gray-900`}>
                ₹{paid.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
                <>
                    <span className={`${mrpClass} text-gray-400 line-through`}>
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">{off}% off</span>
                </>
            )}
        </span>
    );
};
