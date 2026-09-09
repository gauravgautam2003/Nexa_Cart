import type { ReactNode } from 'react'

export function Toast({ children, tone = 'success' }: { children: ReactNode; tone?: 'success' | 'error' | 'info' }) {
    const colors = { success: 'border-emerald-200 bg-emerald-50 text-emerald-800', error: 'border-red-200 bg-red-50 text-red-800', info: 'border-sky-200 bg-sky-50 text-sky-800' }
    return <div className={`rounded-lg border px-4 py-3 text-sm ${colors[tone]}`} role="status">{children}</div>
}

export default Toast