"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton, EmptyState } from "@/components/ui/Feedback";
import { getCategories, listProducts } from "@/features/products/products.api";
import type { Product, ProductSort } from "@/features/products/products.types";
import { FALLBACK_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/helpers";

const PRICE_BANDS = [
    { label: "Under ₹500", min: undefined as number | undefined, max: 500 },
    { label: "₹500 – ₹2,000", min: 500, max: 2000 },
    { label: "₹2,000 – ₹10,000", min: 2000, max: 10000 },
    { label: "₹10,000+", min: 10000, max: undefined as number | undefined },
];

function ProductsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const sort = (searchParams.get("sort") ?? "newest") as ProductSort;
    const page = Number(searchParams.get("page") ?? 1) || 1;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, pages: 1 });
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        getCategories()
            .then((list) => setCategories(list.length > 0 ? list : FALLBACK_CATEGORIES))
            .catch(() => setCategories(FALLBACK_CATEGORIES));
    }, []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        listProducts({
            search: search || undefined,
            category: category || undefined,
            sort,
            page,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        })
            .then((result) => {
                if (!cancelled) {
                    setProducts(result.products);
                    setPagination(result.pagination);
                }
            })
            .catch(() => {
                if (!cancelled) setError("Could not load products. Is the backend running?");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [search, category, sort, page, minPrice, maxPrice]);

    const updateParams = useCallback(
        (updates: Record<string, string | number | undefined>, resetPage = true) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(updates)) {
                if (value === undefined || value === "" || value === "newest") {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            }

            if (resetPage) params.delete("page");
            router.push(`${pathname}${params.size > 0 ? `?${params.toString()}` : ""}`, { scroll: false });
        },
        [router, pathname, searchParams],
    );

    const activePriceBand = PRICE_BANDS.findIndex(
        (band) => String(band.min ?? "") === (minPrice ?? "") && String(band.max ?? "") === (maxPrice ?? ""),
    );

    const filters = (
        <div className="space-y-6">
            <div>
                <p className="mb-2.5 text-sm font-bold text-gray-900">Category</p>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => updateParams({ category: undefined })}
                        className={cn(
                            "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                            !category ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100",
                        )}
                    >
                        All categories
                    </button>
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                updateParams({ category: item === category ? undefined : item })
                            }
                            className={cn(
                                "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                                item === category ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100",
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-2.5 text-sm font-bold text-gray-900">Price</p>
                <div className="flex flex-wrap gap-2">
                    {PRICE_BANDS.map((band, index) => (
                        <button
                            key={band.label}
                            type="button"
                            onClick={() =>
                                updateParams(
                                    activePriceBand === index
                                        ? { minPrice: undefined, maxPrice: undefined }
                                        : {
                                              minPrice: band.min,
                                              maxPrice: band.max,
                                          },
                                )
                            }
                            className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                                activePriceBand === index
                                    ? "border-brand bg-brand text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-brand/50",
                            )}
                        >
                            {band.label}
                        </button>
                    ))}
                </div>
            </div>

            {(category || minPrice || maxPrice || search) && (
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                        router.push(pathname, { scroll: false })
                    }
                >
                    Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <div className="page-shell py-6 sm:py-8">
            {/* Breadcrumb + heading */}
            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Home {category && <> / {category}</>}
                </p>
                <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {search ? `Results for “${search}”` : category || "All products"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {!loading && !error && `${pagination.total} products · every listing agent-verified`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm lg:hidden"
                            onClick={() => setFiltersOpen((open) => !open)}
                        >
                            {filtersOpen ? "Hide filters" : "Filters"}
                        </button>

                        <label className="flex items-center gap-2 text-sm text-gray-500">
                            Sort
                            <select
                                value={sort}
                                onChange={(event) => updateParams({ sort: event.target.value })}
                                className="input !w-auto !py-1.5 text-sm"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                {/* Filters */}
                <aside className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
                    <div className="card p-4 lg:sticky lg:top-40">{filters}</div>
                </aside>

                {/* Grid */}
                <div>
                    {loading && (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <EmptyState
                            icon={<SearchX size={40} />}
                            title="Nothing came back"
                            subtitle={error}
                        />
                    )}

                    {!loading && !error && products.length === 0 && (
                        <EmptyState
                            icon={<SearchX size={40} />}
                            title="No products found"
                            subtitle="Try a different search term or clear the filters."
                            action={
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => router.push(pathname)}
                                >
                                    Clear filters
                                </button>
                            }
                        />
                    )}

                    {!loading && !error && products.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {pagination.pages > 1 && (
                                <nav
                                    className="mt-8 flex items-center justify-center gap-2"
                                    aria-label="Pagination"
                                >
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() =>
                                            updateParams({ page: pagination.page - 1 }, false)
                                        }
                                    >
                                        <ChevronLeft size={14} /> Prev
                                    </button>

                                    {Array.from({ length: Math.min(5, pagination.pages) }).map((_, index) => {
                                        const start = Math.max(
                                            1,
                                            Math.min(pagination.page - 2, pagination.pages - 4),
                                        );
                                        const current = start + index;
                                        if (current > pagination.pages) return null;

                                        return (
                                            <button
                                                key={current}
                                                type="button"
                                                onClick={() => updateParams({ page: current }, false)}
                                                className={cn(
                                                    "h-8 w-8 rounded-lg text-sm font-semibold transition",
                                                    current === pagination.page
                                                        ? "bg-brand text-white"
                                                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand/40",
                                                )}
                                            >
                                                {current}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() =>
                                            updateParams({ page: pagination.page + 1 }, false)
                                        }
                                    >
                                        Next <ChevronRight size={14} />
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="page-shell py-10"><div className="skeleton h-64" /></div>}>
            <ProductsContent />
        </Suspense>
    );
}
