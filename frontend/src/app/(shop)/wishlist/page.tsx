"use client";

import Link from "next/link";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { addToCartThunk } from "@/redux/slices/cartSlice";
import { PriceTag, Stars } from "@/components/ui/PriceTag";
import { EmptyState } from "@/components/ui/Feedback";

export default function WishlistPage() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.wishlist.items);
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="page-shell py-6 sm:py-8">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Wishlist</h1>
                <p className="text-sm text-gray-500">
                    {items.length} saved {items.length === 1 ? "item" : "items"} · stored on this
                    device
                </p>
            </div>

            {items.length === 0 ? (
                <EmptyState
                    icon={<Heart size={40} />}
                    title="Your wishlist is empty"
                    subtitle="Tap the heart on any product to save it for later."
                    action={
                        <Link href="/products" className="btn btn-primary">
                            Explore products <ArrowRight size={15} />
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                        <div key={item.id} className="card flex flex-col overflow-hidden">
                            <Link href={`/products/${item.id}`} className="relative aspect-square bg-gray-100">
                                {item.images[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition hover:scale-105"
                                    />
                                ) : (
                                    <span className="flex h-full items-center justify-center text-5xl font-black text-gray-300">
                                        {item.name.charAt(0)}
                                    </span>
                                )}
                            </Link>

                            <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                                <Link
                                    href={`/products/${item.id}`}
                                    className="clamp-2 text-sm font-semibold text-gray-900 hover:text-brand"
                                >
                                    {item.name}
                                </Link>
                                <Stars rating={item.rating} reviewCount={item.reviewCount} />
                                <div className="mt-auto">
                                    <PriceTag
                                        product={{ price: item.price, discountPrice: item.discountPrice }}
                                        size="sm"
                                    />
                                </div>

                                <div className="mt-2 flex gap-2">
                                    <button
                                        type="button"
                                        disabled={item.stock === 0}
                                        className="btn btn-primary btn-sm flex-1"
                                        onClick={() => {
                                            if (user) {
                                                void dispatch(addToCartThunk({ productId: item.id, quantity: 1 }));
                                            } else {
                                                window.location.href = `/login?next=/products/${item.id}`;
                                            }
                                        }}
                                    >
                                        {item.stock === 0 ? "Out of stock" : "Move to cart"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        aria-label="Remove from wishlist"
                                        onClick={() => dispatch(removeWishlistItem(item.id))}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
