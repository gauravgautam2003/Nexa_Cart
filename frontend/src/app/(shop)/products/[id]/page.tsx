"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    CircleAlert,
    Heart,
    Lightbulb,
    PackageX,
    RotateCcw,
    ShieldCheck,
    ShoppingCart,
    Truck,
    Wallet,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCartThunk } from "@/redux/slices/cartSlice";
import { toggleWishlist, type WishlistItem } from "@/redux/slices/wishlistSlice";
import { getProduct } from "@/features/products/products.api";
import { getAgentReport } from "@/features/agent/agent.api";
import type { Product } from "@/features/products/products.types";
import type { AgentReport, CheckStatus } from "@/features/agent/agent.types";
import { cn, discountPercent, finalPrice, formatDate, statusMeta } from "@/lib/helpers";
import { PriceTag, Stars } from "@/components/ui/PriceTag";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { Spinner } from "@/components/ui/Feedback";

const CHECK_STYLES: Record<CheckStatus, { icon: React.ReactNode; chip: string }> = {
    pass: { icon: <BadgeCheck size={15} />, chip: "text-emerald-600" },
    warn: { icon: <CircleAlert size={15} />, chip: "text-amber-600" },
    fail: { icon: <CircleAlert size={15} />, chip: "text-rose-600" },
    skipped: { icon: <RotateCcw size={15} />, chip: "text-gray-400" },
};

const VERDICT_LABEL: Record<AgentReport["verdict"], string> = {
    verified: "NexaGuard verified",
    needs_review: "Under review",
    rejected: "Needs rework",
};

const VERDICT_CHIP: Record<AgentReport["verdict"], string> = {
    verified: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    needs_review: "bg-amber-100 text-amber-800 ring-amber-200",
    rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

function ScoreRing({ score }: { score: number }) {
    const clamped = Math.max(0, Math.min(100, score));
    const color = clamped >= 85 ? "#059669" : clamped >= 60 ? "#d97706" : "#e11d48";

    return (
        <div
            className="relative flex h-20 w-20 flex-none items-center justify-center rounded-full"
            style={{
                background: `conic-gradient(${color} ${clamped * 3.6}deg, #e5e7eb 0deg)`,
            }}
            aria-label={`NexaGuard score ${clamped} out of 100`}
        >
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-lg font-black text-gray-900">{clamped}</span>
                <span className="text-[9px] font-semibold uppercase text-gray-400">/ 100</span>
            </div>
        </div>
    );
}

function AgentPanel({ productId }: { productId: string }) {
    const [report, setReport] = useState<AgentReport | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "pending" | "error">("loading");

    useEffect(() => {
        let cancelled = false;

        getAgentReport(productId)
            .then((result) => {
                if (cancelled) return;
                if (result) {
                    setReport(result);
                    setStatus("ready");
                } else {
                    setStatus("pending");
                }
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [productId]);

    if (status === "loading") {
        return (
            <section className="card p-5">
                <div className="flex items-center gap-3">
                    <Spinner />
                    <p className="text-sm text-gray-500">NexaGuard is fetching its report…</p>
                </div>
            </section>
        );
    }

    if (status === "error") {
        return (
            <section className="card p-5">
                <p className="text-sm text-gray-500">
                    Verification report is temporarily unavailable.
                </p>
            </section>
        );
    }

    if (status === "pending" || !report) {
        return (
            <section className="card p-5">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <ShieldCheck size={17} />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Verification pending
                        </p>
                        <p className="text-xs leading-5 text-gray-500">
                            NexaGuard checks every listing the moment it is created or edited.
                            This one is still in the queue.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const verdict = statusMeta(report.verdict);
    const passed = report.checks.filter((check) => check.status === "pass").length;

    return (
        <section className="card overflow-hidden" aria-label="NexaGuard verification report">
            <header className="flex items-center gap-4 border-b border-gray-100 bg-gradient-to-r from-brand-soft to-white p-5">
                <ScoreRing score={report.score} />
                <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                        <ShieldCheck size={15} className="text-brand" /> NexaGuard verification
                    </p>
                    <span className={cn("chip mt-1.5", VERDICT_CHIP[report.verdict])}>
                        {VERDICT_LABEL[report.verdict]}
                    </span>
                    <p className="mt-1.5 text-xs text-gray-500">
                        {passed}/{report.checks.length} checks passed · engine{" "}
                        {report.engineVersion}
                    </p>
                </div>
            </header>

            <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-gray-600">{report.summary}</p>

                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                        Checks
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {report.checks.map((check) => {
                            const style = CHECK_STYLES[check.status];
                            return (
                                <li
                                    key={check.key}
                                    className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5"
                                    title={check.detail}
                                >
                                    <span className={cn("mt-0.5 flex-none", style.chip)}>
                                        {style.icon}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-800">
                                            {check.label}
                                        </p>
                                        <p className="clamp-2 text-[11px] leading-4 text-gray-500">
                                            {check.detail}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {report.issues.length > 0 && (
                    <div className="rounded-xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                            <CircleAlert size={13} /> Issues found
                        </p>
                        <ul className="mt-1.5 list-inside list-disc space-y-1 text-xs text-rose-700/90">
                            {report.issues.map((issue) => (
                                <li key={issue}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {report.suggestions.length > 0 && (
                    <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                            <Lightbulb size={13} /> Agent suggestions
                        </p>
                        <ul className="mt-1.5 list-inside list-disc space-y-1 text-xs text-amber-700/90">
                            {report.suggestions.map((suggestion) => (
                                <li key={suggestion}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {report.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {report.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-[10px] uppercase tracking-wide text-gray-300">
                    Checked {formatDate(report.verifiedAt)}
                </p>
            </div>
        </section>
    );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector((state) => state.auth.user);
    const wished = useAppSelector((state) => state.wishlist.items.some((item) => item.id === id));

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getProduct(id)
            .then((result) => {
                if (!cancelled) setProduct(result);
            })
            .catch((error: unknown) => {
                if (!cancelled) {
                    const status =
                        error && typeof error === "object" && "response" in error
                            ? (error as { response?: { status?: number } }).response?.status
                            : undefined;
                    setLoadError(status === 404 ? "This product does not exist." : "Could not load the product.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleAdd = async () => {
        if (!user) {
            router.push(`/login?next=/products/${id}`);
            return;
        }

        setAdding(true);
        try {
            await dispatch(addToCartThunk({ productId: id, quantity })).unwrap();
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
        } catch {
            // Slice stores the error; button stays enabled.
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="page-shell py-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="skeleton aspect-square" />
                    <div className="space-y-4">
                        <div className="skeleton h-6 w-3/4" />
                        <div className="skeleton h-4 w-1/2" />
                        <div className="skeleton h-10 w-1/3" />
                        <div className="skeleton h-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (loadError || !product) {
        return (
            <div className="page-shell py-16 text-center">
                <PackageX size={44} className="mx-auto text-gray-300" />
                <h1 className="mt-4 text-xl font-bold text-gray-900">{loadError}</h1>
                <Link href="/products" className="btn btn-primary mt-5">
                    <ArrowLeft size={15} /> Back to products
                </Link>
            </div>
        );
    }

    const images = product.images.length > 0 ? product.images : [];
    const currentImage = images[activeImage];
    const off = discountPercent(product);
    const paid = finalPrice(product);
    const inStock = product.stock > 0;

    const toggleWish = () => {
        dispatch(
            toggleWishlist({
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
            }),
        );
    };

    return (
        <div className="page-shell py-6 sm:py-8">
            <nav className="mb-5 flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-brand">
                    Home
                </Link>
                <span>/</span>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand">
                    {product.category}
                </Link>
                <span>/</span>
                <span className="truncate text-gray-700">{product.name}</span>
            </nav>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr_340px] lg:gap-8">
                {/* Gallery */}
                <div>
                    <div className="card overflow-hidden">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                            {currentImage && !imgFailed ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    onError={() => setImgFailed(true)}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <span className="text-7xl font-black text-gray-300">
                                        {product.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {off > 0 && (
                                <span className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                                    {off}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    key={image}
                                    type="button"
                                    onClick={() => {
                                        setActiveImage(index);
                                        setImgFailed(false);
                                    }}
                                    className={cn(
                                        "h-16 w-16 flex-none overflow-hidden rounded-lg border-2 bg-gray-100 transition",
                                        index === activeImage ? "border-brand" : "border-transparent opacity-70",
                                    )}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={image} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main info */}
                <div>
                    {product.brand && (
                        <p className="text-xs font-bold uppercase tracking-wide text-brand">
                            {product.brand}
                        </p>
                    )}
                    <h1 className="mt-1 text-2xl font-bold leading-8 text-gray-900 sm:text-3xl">
                        {product.name}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <Stars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                        <span className="chip bg-gray-100 text-gray-600 ring-gray-200">
                            {product.category}
                        </span>
                        <span className="chip bg-brand-soft text-brand ring-emerald-100">
                            <ShieldCheck size={12} /> Agent checked
                        </span>
                    </div>

                    <div className="mt-4 border-y border-gray-100 py-4">
                        <PriceTag product={product} size="lg" />
                        <p className="mt-1 text-xs text-gray-500">
                            Inclusive of all taxes
                            {off > 0 && (
                                <>
                                    {" · "}
                                    <span className="font-semibold text-emerald-600">
                                        You save {off}%
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-bold text-gray-900">About this item</p>
                        <p className="mt-1.5 text-sm leading-6 text-gray-600">
                            {product.description}
                        </p>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                            <dt className="text-gray-400">SKU</dt>
                            <dd className="font-semibold text-gray-700">{product.sku}</dd>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                            <dt className="text-gray-400">Listed</dt>
                            <dd className="font-semibold text-gray-700">
                                {formatDate(product.createdAt)}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Buy box + agent */}
                <div className="space-y-4">
                    <div className="card p-5">
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{paid.toLocaleString("en-IN")}
                        </p>

                        <p className={cn("mt-1 text-sm font-semibold", inStock ? "text-emerald-600" : "text-rose-600")}>
                            {inStock
                                ? product.stock <= 5
                                    ? `Only ${product.stock} left in stock`
                                    : "In stock"
                                : "Currently unavailable"}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <Truck size={13} /> Free delivery above ₹4,999
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <QuantityStepper
                                value={quantity}
                                onChange={setQuantity}
                                max={Math.max(1, Math.min(product.stock, 10))}
                                disabled={!inStock}
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={!inStock || adding}
                                className={cn("btn btn-lg btn-block", added ? "btn-accent" : "btn-primary")}
                            >
                                {adding ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        {added ? "Added to cart" : "Add to cart"}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!user) {
                                        router.push(`/login?next=/products/${id}`);
                                        return;
                                    }
                                    void handleAdd().then(() => router.push("/checkout"));
                                }}
                                disabled={!inStock || adding}
                                className="btn btn-lg btn-block btn-accent"
                            >
                                Buy now
                            </button>
                            <button
                                type="button"
                                onClick={toggleWish}
                                className={cn("btn btn-lg btn-block btn-ghost", wished && "text-rose-500")}
                            >
                                <Heart size={16} fill={wished ? "currentColor" : "none"} />
                                {wished ? "In wishlist" : "Add to wishlist"}
                            </button>
                        </div>

                        <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                            <li className="flex items-center gap-2">
                                <Wallet size={14} className="text-brand" /> UPI, cards & cash on
                                delivery
                            </li>
                            <li className="flex items-center gap-2">
                                <RotateCcw size={14} className="text-brand" /> 7-day easy returns
                            </li>
                            <li className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-brand" /> Sold by a verified
                                seller
                            </li>
                        </ul>
                    </div>

                    <AgentPanel productId={product.id} />
                </div>
            </div>
        </div>
    );
}
