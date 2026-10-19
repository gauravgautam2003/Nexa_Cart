"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Heart,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Receipt,
    Search,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    User,
    X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk, restoreThunk } from "@/redux/slices/authSlice";
import { fetchCartThunk, resetLocalCart } from "@/redux/slices/cartSlice";
import { FALLBACK_CATEGORIES, SHOP_NAME } from "@/lib/constants";
import { cn, timeAgo } from "@/lib/helpers";
import {
    listNotifications,
    markAllNotificationsRead,
    type Notification,
} from "@/features/notifications/notifications.api";

const NAV_LINKS = [
    { href: "/products", label: "All Products" },
    { href: "/orders", label: "My Orders" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/checkout", label: "Checkout" },
];

export default function Navbar() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const user = useAppSelector((state) => state.auth.user);
    const totalItems = useAppSelector((state) => state.cart.totalItems);
    const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

    const [query, setQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationsStatus, setNotificationsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

    const accountRef = useRef<HTMLDivElement | null>(null);
    const bellRef = useRef<HTMLDivElement | null>(null);

    // Sync the search box with ?search= without using useSearchParams in the layout.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setQuery(params.get("search") ?? "");
    }, [pathname]);

    // Keep the cart in sync with the signed-in user.
    useEffect(() => {
        if (user) {
            void dispatch(fetchCartThunk());
        } else {
            dispatch(resetLocalCart());
        }
    }, [user, dispatch]);

    // Close popovers on outside click.
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setAccountOpen(false);
            }
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setBellOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // Close the mobile drawer on navigation.
    useEffect(() => {
        setMobileOpen(false);
        setAccountOpen(false);
        setBellOpen(false);
    }, [pathname]);

    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = query.trim();
        router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
    };

    const openNotifications = async () => {
        if (!user) return;
        setBellOpen((open) => !open);

        if (notificationsStatus === "idle" || notificationsStatus === "error") {
            setNotificationsStatus("loading");
            try {
                const items = await listNotifications(user.id);
                setNotifications(items);
                setNotificationsStatus("ready");
            } catch {
                setNotificationsStatus("error");
            }
        }
    };

    const markAllRead = async () => {
        if (!user) return;
        try {
            await markAllNotificationsRead(user.id);
            setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
        } catch {
            // Non-critical; leave the list as-is.
        }
    };

    const unread = notifications.filter((item) => !item.isRead).length;

    const searchBox = (
        <form onSubmit={submitSearch} className="relative flex w-full items-center" role="search">
            <Search size={16} className="pointer-events-none absolute left-3.5 text-gray-400" />
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, brands and categories…"
                aria-label="Search products"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-24 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
                type="submit"
                className="btn btn-primary absolute right-1.5 h-7 btn-sm"
                aria-label="Search"
            >
                Search
            </button>
        </form>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
            {/* Main bar */}
            <div className="page-shell flex h-16 items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    className="btn btn-ghost !p-2 md:hidden"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <Link href="/" className="flex items-center gap-2" aria-label={`${SHOP_NAME} home`}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                        <Sparkles size={18} />
                    </span>
                    <span className="text-lg font-extrabold tracking-tight text-gray-900">
                        Nexa<span className="text-brand">Cart</span>
                    </span>
                </Link>

                <div className="hidden flex-1 md:flex">{searchBox}</div>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    {/* Notifications */}
                    {user && (
                        <div className="relative" ref={bellRef}>
                            <button
                                type="button"
                                onClick={() => void openNotifications()}
                                className="relative btn btn-ghost !p-2"
                                aria-label="Notifications"
                            >
                                <Bell size={19} />
                                {unread > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                        {unread}
                                    </span>
                                )}
                            </button>

                            {bellOpen && (
                                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                        {notifications.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => void markAllRead()}
                                                className="text-xs font-semibold text-brand hover:underline"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notificationsStatus === "loading" && (
                                            <div className="space-y-3 p-4">
                                                {[0, 1, 2].map((i) => (
                                                    <div key={i} className="skeleton h-10" />
                                                ))}
                                            </div>
                                        )}
                                        {notificationsStatus === "error" && (
                                            <p className="p-4 text-sm text-gray-500">
                                                Could not load notifications.
                                            </p>
                                        )}
                                        {notificationsStatus === "ready" && notifications.length === 0 && (
                                            <p className="p-4 text-sm text-gray-500">
                                                No notifications yet.
                                            </p>
                                        )}
                                        {notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "border-b border-gray-50 px-4 py-3 last:border-none",
                                                    !item.isRead && "bg-brand-soft/60",
                                                )}
                                            >
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500 clamp-2">
                                                    {item.message}
                                                </p>
                                                <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                                                    {item.channel} · {timeAgo(item.createdAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        className="relative btn btn-ghost !p-2"
                        aria-label="Wishlist"
                    >
                        <Heart size={19} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Account */}
                    <div className="relative hidden sm:block" ref={accountRef}>
                        <button
                            type="button"
                            onClick={() => setAccountOpen((open) => !open)}
                            className="btn btn-ghost !py-2"
                            aria-label="Account menu"
                        >
                            <User size={18} />
                            <span className="hidden max-w-24 truncate text-sm lg:inline">
                                {user ? user.name.split(" ")[0] : "Sign in"}
                            </span>
                        </button>

                        {accountOpen && (
                            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                {user ? (
                                    <>
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <nav className="p-1.5 text-sm">
                                            <Link href="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                                                <Package size={15} /> My Orders
                                            </Link>
                                            <Link href="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                                                <Heart size={15} /> Wishlist
                                            </Link>
                                            <Link href="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                                                <Receipt size={15} /> Track order
                                            </Link>
                                            {user.role === "admin" && (
                                                <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                                                    <LayoutDashboard size={15} /> Admin console
                                                </Link>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => void dispatch(logoutThunk())}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50"
                                            >
                                                <LogOut size={15} /> Sign out
                                            </button>
                                        </nav>
                                    </>
                                ) : (
                                    <div className="p-3">
                                        <p className="mb-2 text-sm text-gray-600">
                                            Sign in for a faster checkout.
                                        </p>
                                        <Link href="/login" className="btn btn-primary btn-sm btn-block">
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="btn btn-ghost btn-sm btn-block mt-2"
                                        >
                                            Create account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative btn btn-primary !px-3"
                        aria-label={`Cart with ${totalItems} items`}
                    >
                        <ShoppingCart size={18} />
                        <span className="hidden text-sm sm:inline">Cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-gray-900">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Search row (mobile) */}
            <div className="page-shell pb-3 md:hidden">{searchBox}</div>

            {/* Category strip */}
            <nav className="border-t border-gray-100 bg-gray-50/70">
                <div className="page-shell no-scrollbar flex items-center gap-1 overflow-x-auto py-1.5 text-[13px] font-medium text-gray-600">
                    <Link
                        href="/products"
                        className="whitespace-nowrap rounded-lg px-2.5 py-1 hover:bg-white hover:text-brand hover:shadow-sm"
                    >
                        All
                    </Link>
                    {FALLBACK_CATEGORIES.slice(0, 8).map((category) => (
                        <Link
                            key={category}
                            href={`/products?category=${encodeURIComponent(category)}`}
                            className="whitespace-nowrap rounded-lg px-2.5 py-1 hover:bg-white hover:text-brand hover:shadow-sm"
                        >
                            {category}
                        </Link>
                    ))}
                    <span className="ml-auto hidden items-center gap-1 whitespace-nowrap rounded-lg bg-brand-soft px-2.5 py-1 text-brand sm:flex">
                        <ShieldCheck size={13} />
                        Every listing AI-verified
                    </span>
                </div>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        className="absolute inset-0 bg-gray-900/40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                            <span className="text-lg font-extrabold text-gray-900">
                                Nexa<span className="text-brand">Cart</span>
                            </span>
                            <button
                                type="button"
                                className="btn btn-ghost !p-2"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-3 text-sm">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block rounded-lg px-3 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <p className="mt-4 px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Shop by category
                            </p>
                            {FALLBACK_CATEGORIES.map((category) => (
                                <Link
                                    key={category}
                                    href={`/products?category=${encodeURIComponent(category)}`}
                                    className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50"
                                >
                                    {category}
                                </Link>
                            ))}

                            {user?.role === "admin" && (
                                <Link
                                    href="/admin"
                                    className="mt-3 block rounded-lg px-3 py-2.5 font-semibold text-brand hover:bg-brand-soft"
                                >
                                    Admin console
                                </Link>
                            )}
                        </nav>

                        <div className="border-t border-gray-100 p-3">
                            {user ? (
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => void dispatch(logoutThunk())}
                                    >
                                        <LogOut size={14} /> Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href="/login" className="btn btn-primary btn-sm flex-1">
                                        Sign in
                                    </Link>
                                    <Link href="/register" className="btn btn-ghost btn-sm flex-1">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}
