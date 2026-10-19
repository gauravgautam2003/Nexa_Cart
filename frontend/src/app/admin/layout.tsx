"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Receipt, ShieldCheck, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/authSlice";
import { cn } from "@/lib/helpers";
import { Spinner } from "@/components/ui/Feedback";

const NAV = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: Receipt },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const user = useAppSelector((state) => state.auth.user);
    const hydrated = useAppSelector((state) => state.auth.hydrated);

    useEffect(() => {
        if (hydrated && !user) {
            router.replace("/login?next=/admin");
        }
    }, [hydrated, user, router]);

    if (!hydrated || !user) {
        return (
            <div className="page-shell flex min-h-[50vh] items-center justify-center gap-3 text-gray-500">
                <Spinner /> Checking access…
            </div>
        );
    }

    if (user.role !== "admin") {
        return (
            <div className="page-shell flex min-h-[50vh] items-center justify-center py-10">
                <div className="card max-w-md p-8 text-center">
                    <ShieldCheck size={40} className="mx-auto text-brand" />
                    <h1 className="mt-4 text-xl font-bold text-gray-900">Admins only</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Your account (<span className="font-medium">{user.email}</span>) has the
                        shopper role. Sign in with an admin account to open the console.
                    </p>
                    <Link href="/" className="btn btn-primary mt-5">
                        Back to store
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell grid gap-6 py-6 lg:grid-cols-[220px_1fr] lg:py-8">
            <aside className="lg:sticky lg:top-40 lg:self-start">
                <div className="card p-3">
                    <p className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">
                        <Sparkles size={13} className="text-brand" /> Admin console
                    </p>
                    <nav className="mt-1 flex gap-1 overflow-x-auto lg:flex-col">
                        {NAV.map((item) => {
                            const active =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-none items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                                        active
                                            ? "bg-brand text-white"
                                            : "text-gray-600 hover:bg-gray-50",
                                    )}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-2 border-t border-gray-100 pt-2">
                        <button
                            type="button"
                            onClick={() => void dispatch(logoutThunk())}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        >
                            <LogOut size={15} /> Sign out
                        </button>
                    </div>
                </div>
            </aside>

            <div className="min-w-0">{children}</div>
        </div>
    );
}
