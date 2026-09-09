import type { ReactNode } from 'react'

type DropdownProps = { label: ReactNode; children: ReactNode }

export function Dropdown({ label, children }: DropdownProps) {
    return <details className="relative"><summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">{label}</summary><div className="absolute right-0 z-10 mt-2 min-w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{children}</div></details>
}

export default Dropdown