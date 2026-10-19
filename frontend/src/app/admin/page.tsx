"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IndianRupee, Package, Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import { listOrders } from "@/features/orders/orders.api";
import { listProducts } from "@/features/products/products.api";
import { listAgentReports } from "@/features/agent/agent.api";
import type { Order } from "@/features/orders/orders.types";
import type { Product } from "@/features/products/products.types";
import type { AgentReport } from "@/features/agent/agent.types";
import { formatINR, statusMeta } from "@/lib/helpers";
import { Spinner } from "@/components/ui/Feedback";

interface Kpi {
    label: string;
    value: string;
    hint: string;
    icon: React.ReactNode;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [reports, setReports] = useState<AgentReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            listOrders().catch(() => [] as Order[]),
            listProducts({ limit: 60 }).catch(() => ({ products: [] as Product[], pagination: { page: 1, limit: 60, total: 0, pages: 1 } })),
            listAgentReports(25).catch(() => [] as AgentReport[]),
        ])
            .then(([orderList, productResult, reportList]) => {
                setOrders(orderList);
                setProducts(productResult.products);
                setReports(reportList);
            })
            .finally(() => setLoading(false));
    }, []);

    const revenue = orders
        .filter((order) => order.orderStatus !== "cancelled")
        .reduce((sum, order) => sum + order.totalAmount, 0);
    const pending = orders.filter((order) =>
        ["pending", "confirmed", "processing"].includes(order.orderStatus),
    ).length;
    const avgScore =
        reports.length > 0
            ? Math.round(reports.reduce((sum, report) => sum + report.score, 0) / reports.length)
            : 0;
    const lowStock = products.filter((product) => product.stock <= 5).length;

    const kpis: Kpi[] = [
        {
            label: "Revenue",
            value: formatINR(revenue),
            hint: `${orders.length} orders total`,
            icon: <IndianRupee size={18} />,
        },
        {
            label: "In fulfilment",
            value: String(pending),
            hint: "awaiting delivery",
            icon: <Receipt size={18} />,
        },
        {
            label: "Products",
            value: String(products.length),
            hint: `${lowStock} low on stock`,
            icon: <Package size={18} />,
        },
        {
            label: "Avg NexaGuard score",
            value: avgScore > 0 ? `${avgScore}/100` : "—",
            hint: `${reports.length} reports`,
            icon: <ShieldCheck size={18} />,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
                <Spinner /> Loading dashboard…
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Live numbers from the product, order and agent services.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="card p-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                            {kpi.icon}
                        </span>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {kpi.label}
                        </p>
                        <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                        <p className="text-xs text-gray-500">{kpi.hint}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Recent orders */}
                <section className="card p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                            Recent orders
                        </h2>
                        <Link href="/admin/orders" className="text-xs font-semibold text-brand hover:underline">
                            View all
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">No orders yet.</p>
                    ) : (
                        <ul className="mt-3 divide-y divide-gray-100">
                            {orders.slice(0, 6).map((order) => {
                                const chip = statusMeta(order.orderStatus);
                                return (
                                    <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="truncate text-xs text-gray-500">
                                                {order.items.length} items · {formatINR(order.totalAmount)}
                                            </p>
                                        </div>
                                        <span className={`chip ${chip.className}`}>{chip.label}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                {/* Agent reports */}
                <section className="card p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-gray-400">
                            <TrendingUp size={14} /> Latest agent checks
                        </h2>
                    </div>

                    {reports.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            The agent has not verified any listing yet.
                        </p>
                    ) : (
                        <ul className="mt-3 divide-y divide-gray-100">
                            {reports.slice(0, 6).map((report) => {
                                const tone =
                                    report.verdict === "verified"
                                        ? "text-emerald-600"
                                        : report.verdict === "needs_review"
                                            ? "text-amber-600"
                                            : "text-rose-600";

                                return (
                                    <li key={report.id} className="flex items-center justify-between gap-3 py-2.5">
                                        <Link
                                            href={`/products/${report.productId}`}
                                            className="min-w-0 truncate text-sm font-medium text-gray-800 hover:text-brand"
                                        >
                                            {report.summary.split(" scored")[0]}
                                        </Link>
                                        <span className={`text-sm font-black ${tone}`}>
                                            {report.score}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
