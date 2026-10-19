"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import {
    createProduct,
    deleteProduct,
    listProducts,
    updateProduct,
} from "@/features/products/products.api";
import { listAgentReports, verifyProduct } from "@/features/agent/agent.api";
import type { Product, ProductInput } from "@/features/products/products.types";
import type { AgentReport } from "@/features/agent/agent.types";
import { getErrorMessage } from "@/services/api";
import { formatINR } from "@/lib/helpers";
import { Spinner } from "@/components/ui/Feedback";

const EMPTY_FORM: FormState = {
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    images: "",
    stock: "",
    sku: "",
};

interface FormState {
    name: string;
    description: string;
    price: string;
    discountPrice: string;
    category: string;
    brand: string;
    images: string;
    stock: string;
    sku: string;
}

const toFormState = (product?: Product): FormState =>
    product
        ? {
              name: product.name,
              description: product.description,
              price: String(product.price),
              discountPrice: product.discountPrice ? String(product.discountPrice) : "",
              category: product.category,
              brand: product.brand ?? "",
              images: product.images.join(", "),
              stock: String(product.stock),
              sku: product.sku,
          }
        : {
              name: "",
              description: "",
              price: "",
              discountPrice: "",
              category: "",
              brand: "",
              images: "",
              stock: "",
              sku: "",
          };

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [reports, setReports] = useState<Record<string, AgentReport>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [checkingId, setCheckingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const [result, reportList] = await Promise.all([
                listProducts({ limit: 60, sort: "newest" }),
                listAgentReports(50).catch(() => [] as AgentReport[]),
            ]);
            setProducts(result.products);
            setReports(Object.fromEntries(reportList.map((report) => [report.productId, report])));
            setError(null);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load products."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setForm(toFormState());
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (product: Product) => {
        setEditing(product);
        setForm(toFormState(product));
        setFormError(null);
        setModalOpen(true);
    };

    const save = async () => {
        const price = Number(form.price);
        const stock = Number(form.stock);

        if (!form.name.trim() || !form.category.trim() || !form.sku.trim()) {
            setFormError("Name, category and SKU are required.");
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            setFormError("Enter a valid price.");
            return;
        }

        setSaving(true);
        setFormError(null);

        const payload: ProductInput = {
            name: form.name.trim(),
            description: form.description.trim() || form.name.trim(),
            price,
            category: form.category.trim(),
            brand: form.brand.trim() || undefined,
            images: form.images
                .split(",")
                .map((image) => image.trim())
                .filter(Boolean),
            stock: Number.isFinite(stock) ? stock : 0,
            sku: form.sku.trim().toUpperCase(),
            discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        };

        try {
            if (editing) {
                await updateProduct(editing.id, payload);
            } else {
                await createProduct(payload);
            }
            setModalOpen(false);
            await load();
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (product: Product) => {
        if (!window.confirm(`Delete "${product.name}"? It will be hidden from the store.`)) return;

        try {
            await deleteProduct(product.id);
            setProducts((items) => items.filter((item) => item.id !== product.id));
        } catch (err) {
            setError(getErrorMessage(err, "Could not delete the product."));
        }
    };

    const runCheck = async (product: Product) => {
        setCheckingId(product.id);
        try {
            const report = await verifyProduct(product.id);
            setReports((map) => ({ ...map, [report.productId]: report }));
        } catch (err) {
            setError(getErrorMessage(err, "Agent check failed."));
        } finally {
            setCheckingId(null);
        }
    };

    const field = (key: keyof FormState, label: string, props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}) => (
        <div>
            <label className="label">{label}</label>
            <input
                className="input"
                value={form[key]}
                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                {...props}
            />
        </div>
    );

    const verifiedCount = useMemo(
        () => products.filter((product) => reports[product.id]?.verdict === "verified").length,
        [products, reports],
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
                <Spinner /> Loading catalogue…
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500">
                        {products.length} listings · {verifiedCount} verified by NexaGuard
                    </p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openCreate}>
                    <Plus size={16} /> New product
                </button>
            </div>

            {error && (
                <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                    {error}
                </p>
            )}

            <div className="card overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Agent</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => {
                            const report = reports[product.id];

                            return (
                                <tr key={product.id} className="align-middle">
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="block max-w-64 truncate font-semibold text-gray-900 hover:text-brand"
                                        >
                                            {product.name}
                                        </Link>
                                        <span className="text-xs text-gray-400">
                                            {product.sku} · {product.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="font-bold text-gray-900">
                                            {formatINR(product.discountPrice ?? product.price)}
                                        </span>
                                        {product.discountPrice && (
                                            <span className="ml-1 text-xs text-gray-400 line-through">
                                                {formatINR(product.price)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`chip ${
                                                product.stock === 0
                                                    ? "bg-rose-100 text-rose-700 ring-rose-200"
                                                    : product.stock <= 5
                                                        ? "bg-amber-100 text-amber-700 ring-amber-200"
                                                        : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm font-black ${
                                                    !report
                                                        ? "text-gray-300"
                                                        : report.verdict === "verified"
                                                            ? "text-emerald-600"
                                                            : report.verdict === "needs_review"
                                                                ? "text-amber-600"
                                                                : "text-rose-600"
                                                }`}
                                            >
                                                {report ? `${report.score}` : "—"}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => void runCheck(product)}
                                                disabled={checkingId === product.id}
                                                title="Run NexaGuard verification"
                                            >
                                                {checkingId === product.id ? (
                                                    <Spinner />
                                                ) : (
                                                    <ShieldCheck size={14} />
                                                )}
                                                Check
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1.5">
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => openEdit(product)}
                                                aria-label="Edit product"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => void remove(product)}
                                                aria-label="Delete product"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <p className="p-8 text-center text-sm text-gray-500">
                        No products yet — create the first one.
                    </p>
                )}
            </div>

            {/* Create / edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute inset-0 bg-gray-900/50"
                        onClick={() => setModalOpen(false)}
                    />
                    <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editing ? "Edit product" : "New product"}
                            </h2>
                            <button
                                type="button"
                                className="btn btn-ghost !p-2"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {field("name", "Product name", { placeholder: "Wireless earbuds" })}
                            {field("brand", "Brand", { placeholder: "Optional" })}
                            {field("category", "Category", { placeholder: "Electronics" })}
                            {field("sku", "SKU", { placeholder: "EAR-BUDS-01" })}
                            {field("price", "Price (₹)", { inputMode: "decimal", type: "number" })}
                            {field("discountPrice", "Discount price (₹)", {
                                inputMode: "decimal",
                                type: "number",
                            })}
                            {field("stock", "Stock", { inputMode: "numeric", type: "number" })}
                            {field("images", "Image URLs (comma separated)", {
                                placeholder: "https://…, https://…",
                            })}

                            <div className="sm:col-span-2">
                                <label className="label">Description</label>
                                <textarea
                                    className="input min-h-24 resize-y"
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, description: event.target.value }))
                                    }
                                    placeholder="What makes this product worth buying?"
                                />
                            </div>
                        </div>

                        {formError && (
                            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
                                {formError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => void save()}
                                disabled={saving}
                            >
                                {saving ? <Spinner /> : editing ? "Save changes" : "Create product"}
                            </button>
                        </div>

                        <p className="mt-3 text-center text-[11px] text-gray-400">
                            Saving automatically queues a NexaGuard verification pass.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
