import type { SelectHTMLAttributes } from 'react'

export function Select({ label, id, children, className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
    return <label className="block space-y-1.5 text-sm font-medium text-slate-700" htmlFor={id}>{label ? <span>{label}</span> : null}<select id={id} className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 ${className}`} {...props}>{children}</select></label>
}

export default Select