import type { ReactNode } from 'react'

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
    const colors = { neutral: 'bg-slate-100 text-slate-700', success: 'bg-emerald-100 text-emerald-700', warning: 'bg-amber-100 text-amber-800', danger: 'bg-red-100 text-red-700' }
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}>{children}</span>
}

export default Badge