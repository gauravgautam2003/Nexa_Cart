import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { SHOP_NAME } from "@/lib/constants";

const columns = [
    {
        title: "Shop",
        links: [
            { href: "/products", label: "All products" },
            { href: "/products?sort=discount", label: "Today's deals" },
            { href: "/products?sort=rating", label: "Top rated" },
            { href: "/wishlist", label: "Wishlist" },
        ],
    },
    {
        title: "Orders",
        links: [
            { href: "/orders", label: "My orders" },
            { href: "/cart", label: "Cart" },
            { href: "/checkout", label: "Checkout" },
        ],
    },
    {
        title: "Account",
        links: [
            { href: "/login", label: "Sign in" },
            { href: "/register", label: "Create account" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-gray-200 bg-white">
            <div className="page-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                            <Sparkles size={16} />
                        </span>
                        <span className="text-base font-extrabold text-gray-900">
                            Nexa<span className="text-brand">Cart</span>
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        An AI-verified marketplace. Every listing passes the NexaGuard
                        10-point check before it reaches your feed.
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                        <ShieldCheck size={13} /> Verified catalog
                    </p>
                </div>

                {columns.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                        <p className="text-sm font-semibold text-gray-900">{column.title}</p>
                        <ul className="mt-3 space-y-2 text-sm text-gray-500">
                            {column.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-brand hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="border-t border-gray-100">
                <div className="page-shell flex flex-col gap-2 py-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} {SHOP_NAME}. Built as a microservices
                        demo — gateway, 8 services, one agent.
                    </p>
                    <p className="flex items-center gap-3">
                        <span>UPI · Cards · Netbanking · Cash on delivery</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
