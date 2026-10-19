import type { ReactNode } from "react";

export const Spinner = ({ className = "" }: { className?: string }) => (
    <span className={`spinner ${className}`} role="status" aria-label="Loading" />
);

export const EmptyState = ({
    icon,
    title,
    subtitle,
    action,
}: {
    icon?: ReactNode;
    title: string;
    subtitle?: string;
    action?: ReactNode;
}) => (
    <div className="card mx-auto flex w-full max-w-md flex-col items-center gap-3 px-6 py-12 text-center">
        {icon && <div className="text-brand">{icon}</div>}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {action && <div className="mt-2">{action}</div>}
    </div>
);

export const ProductCardSkeleton = () => (
    <div className="card overflow-hidden">
        <div className="skeleton aspect-square rounded-none" />
        <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-5 w-1/3" />
        </div>
    </div>
);

export const Badge = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => (
    <span className={`chip ${className}`}>{children}</span>
);
