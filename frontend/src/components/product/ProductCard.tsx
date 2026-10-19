"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShieldCheck, ShoppingCart } from "lucide-react";
import type { Product } from "@/features/products/products.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCartThunk } from "@/redux/slices/cartSlice";
import { toggleWishlist, type WishlistItem } from "@/redux/slices/wishlistSlice";
import { cn, discountPercent, finalPrice } from "@/lib/helpers";
import { PriceTag, Stars } from "@/components/ui/PriceTag";

const toWishlistItem = (product: Product): WishlistItem => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images,
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category,
    stock: product.stock,
});

export default function ProductCard({ product }: { product: Product }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector((state) => state.auth.user);
    const wished = useAppSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id),
    );

    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);

    const image = product.images[0];
    const off = discountPercent(product);

    const handleAdd = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            router.push(`/login?next=/products/${product.id}`);
            return;
        }

        setAdding(true);
        try {
            await dispatch(addToCartThunk({ productId: product.id, quantity: 1 })).unwrap();
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1600);
        } catch {
            // Error surfaced via cart slice; keep the button usable.
        } finally {
            setAdding(false);
        }
    };

    return (
        <Link
            href={`/products/${product.id}`}
            className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {image && !imgFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImgFailed(true)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-5xl font-black text-gray-300">
                            {product.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {off > 0 && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        {off}% OFF
                    </span>
                )}

                <button
                    type="button"
                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        dispatch(toggleWishlist(toWishlistItem(product)));
                    }}
                    className={cn(
                        "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110",
                        wished ? "text-rose-500" : "text-gray-400",
                    )}
                >
                    <Heart size={15} fill={wished ? "currentColor" : "none"} />
                </button>

                {product.stock === 0 && (
                    <span className="absolute inset-x-0 bottom-0 bg-gray-900/80 py-1.5 text-center text-xs font-semibold text-white">
                        Out of stock
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                {product.brand && (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {product.brand}
                    </span>
                )}

                <h3 className="clamp-2 text-sm font-semibold leading-5 text-gray-900">
                    {product.name}
                </h3>

                <Stars rating={product.rating} reviewCount={product.reviewCount} />

                <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <PriceTag product={product} size="sm" />
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
                        <ShieldCheck size={12} /> Verified
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={adding || product.stock === 0}
                    className={cn(
                        "btn btn-sm mt-1 w-full",
                        added ? "btn-accent" : "btn-ghost",
                    )}
                >
                    {adding ? (
                        <span className="spinner" />
                    ) : (
                        <>
                            <ShoppingCart size={14} />
                            {added ? "Added to cart" : "Add to cart"}
                        </>
                    )}
                </button>
            </div>
        </Link>
    );
}
