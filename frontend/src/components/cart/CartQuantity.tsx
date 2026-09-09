'use client'

import Button from '../ui/Button'

export function CartQuantity({ value, onChange, min = 1, max = 99 }: { value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return <div className="inline-flex items-center rounded-lg border border-slate-300"><Button className="min-h-8 rounded-none px-3 py-1" variant="ghost" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity">-</Button><span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">{value}</span><Button className="min-h-8 rounded-none px-3 py-1" variant="ghost" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity">+</Button></div>
}

export default CartQuantity