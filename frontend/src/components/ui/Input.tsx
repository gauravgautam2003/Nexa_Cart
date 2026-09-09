import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
}

export function Input({ id, label, error, className = '', ...props }: InputProps) {
    return (
        <label className="block space-y-1.5 text-sm font-medium text-slate-700" htmlFor={id}>
            {label ? <span>{label}</span> : null}
            <input id={id} className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 ${className}`} {...props} />
            {error ? <span className="block text-xs font-normal text-red-600">{error}</span> : null}
        </label>
    )
}

export default Input