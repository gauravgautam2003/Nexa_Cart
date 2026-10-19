"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    PackageSearch,
    ShieldCheck,
    Sparkles,
    Truck,
    Wallet,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Feedback";
import { getCategories, listProducts } from "@/features/products/products.api";
import type { Product } from "@/features/products/products.types";
import { FALLBACK_CATEGORIES, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

const categoryIcon = (index: number) => {
    const icons = ["📱", "👗", "🛋️", "💄", "📚", "🏋️", "🧸", "🍎"];
    return icons[index % icons.length];
};

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [featured, categoryList] = await Promise.all([
                    listProducts({ sort: "rating", limit: 8 }),
                    getCategories().catch(() => [] as string[]),
                ]);

                if (!cancelled) {
                    setProducts(featured.products);
                    setCategories(categoryList.length > 0 ? categoryList : FALLBACK_CATEGORIES);
                }
            } catch {
                if (!cancelled) setError("Could not reach the store. Is the backend running?");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const deals = useMemo(
        () => products.filter((product) => product.discountPrice && product.discountPrice < product.price).slice(0, 4),
        [products],
    );

    return (
        <div className="pb-6">
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand via-brand-strong to-[#083f3a] text-white">
                <div className="page-shell grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                            <Sparkles size={13} /> India&apos;s first AI-verified marketplace
                        </span>
                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Shopping you can
                            <span className="block text-amber-300">trust, down to the specs.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/90 sm:text-base">
                            Every product on NexaCart is re-checked by the NexaGuard agent —
                            pricing, imagery, stock sync and more — before it ever reaches
                            your feed.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/products" className="btn btn-accent btn-lg">
                                Shop now <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/products?sort=newest"
                                className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20"
                            >
                                New arrivals
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-emerald-100/70">
                            Free delivery above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                            { icon: <ShieldCheck size={20} />, title: "10-point AI check", copy: "on every listing" },
                            { icon: <Truck size={20} />, title: "Fast delivery", copy: "tracked end-to-end" },
                            { icon: <Wallet size={20} />, title: "UPI & COD", copy: "Razorpay secured" },
                            { icon: <BadgeCheck size={20} />, title: "Live inventory", copy: "no overselling" },
                        ].map((tile) => (
                            <div
                                key={tile.title}
                                className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur sm:p-5"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-gray-900">
                                    {tile.icon}
                                </span>
                                <p className="mt-3 text-sm font-bold">{tile.title}</p>
                                <p className="text-xs text-emerald-100/80">{tile.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="page-shell mt-10">
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Shop by category
                        </h2>
                        <p className="text-sm text-gray-500">Hand-picked, agent-verified.</p>
                    </div>
                    <Link
                        href="/products"
                        className="text-sm font-semibold text-brand hover:underline"
                    >
                        View all
                    </Link>
                </div>

                <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
                    {categories.slice(0, 8).map((category, index) => (
                        <Link
                            key={category}
                            href={`/products?category=${encodeURIComponent(category)}`}
                            className="card flex min-w-28 flex-col items-center gap-2 px-3 py-4 text-center transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md sm:min-w-0"
                        >
                            <span className="text-2xl">{categoryIcon(index)}</span>
                            <span className="text-xs font-semibold text-gray-700">{category}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Deals */}
            {deals.length > 0 && (
                <section className="page-shell mt-10">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                Today&apos;s deals
                            </h2>
                            <p className="text-sm text-gray-500">Limited-time price drops.</p>
                        </div>
                        <Link
                            href="/products?sort=discount"
                            className="text-sm font-semibold text-brand hover:underline"
                        >
                            All deals
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {deals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured */}
            <section className="page-shell mt-10">
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Top rated on NexaCart
                        </h2>
                        <p className="text-sm text-gray-500">
                            Ranked by customers, cleared by NexaGuard.
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="card mx-auto max-w-lg px-6 py-10 text-center">
                        <PackageSearch size={40} className="mx-auto text-gray-300" />
                        <p className="mt-3 font-semibold text-gray-900">{error}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            Start the backend (<code className="rounded bg-gray-100 px-1">docker compose up</code>{" "}
                            or the gateway + services) and reload.
                        </p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Trust band */}
            <section className="page-shell mt-12">
                <div className="card grid gap-6 bg-gradient-to-r from-brand-soft to-white p-6 sm:grid-cols-3 sm:p-8">
                    {[
                        {
                            icon: <Sparkles size={18} />,
                            title: "NexaGuard agent",
                            copy: "Ten automated checks score every listing the moment it is created or edited.",
                        },
                        {
                            icon: <Truck size={18} />,
                            title: "Inventory-synced",
                            copy: "Catalogue stock is cross-checked against the warehouse before you buy.",
                        },
                        {
                            icon: <Wallet size={18} />,
                            title: "Secure payments",
                            copy: "Razorpay signatures verified server-side, or pay cash on delivery.",
                        },
                    ].map((item) => (
                        <div key={item.title} className="flex gap-3">
                            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand text-white">
                                {item.icon}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                <p className="mt-0.5 text-xs leading-5 text-gray-600">{item.copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
