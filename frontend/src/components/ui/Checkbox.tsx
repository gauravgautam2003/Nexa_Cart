import type { InputHTMLAttributes } from 'react'

export function Checkbox({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
    return <label className="inline-flex items-center gap-2 text-sm text-slate-700" htmlFor={id}><input id={id} type="checkbox" className="size-4 rounded border-slate-300 accent-slate-900" {...props} />{label}</label>
}

export default Checkbox