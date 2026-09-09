import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
    return <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center"><h2 className="text-lg font-bold text-slate-900">{title}</h2>{description ? <p className="max-w-md text-sm text-slate-500">{description}</p> : null}{action}</div>
}

export default EmptyState