import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
    return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`} {...props}>{children}</div>
}

export default Card