'use client'

import { useState } from 'react'
import CartQuantity from './CartQuantity'
import RemoveCartItem from './RemoveCartItem'

export type CartItemData = { id: string | number; name: string; price: number; quantity: number; image?: string }
type CartItemProps = { item: CartItemData; onQuantityChange?: (quantity: number) => void; onRemove?: () => void; currency?: string }

export function CartItem({ item, onQuantityChange, onRemove, currency = '$' }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const updateQuantity = (next: number) => { setQuantity(next); onQuantityChange?.(next) }
  return <article className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-4"><div className="flex size-20 items-center justify-center overflow-hidden rounded-lg bg-slate-100">{item.image ? <img className="size-full object-cover" src={item.image} alt="" /> : <span className="text-xs text-slate-400">No image</span>}</div><div className="min-w-40 flex-1"><h3 className="font-semibold text-slate-900">{item.name}</h3><p className="mt-1 text-sm text-slate-500">{currency}{item.price.toFixed(2)} each</p></div><CartQuantity value={quantity} onChange={updateQuantity} /><p className="w-24 text-right font-semibold text-slate-900">{currency}{(item.price * quantity).toFixed(2)}</p>{onRemove ? <RemoveCartItem onRemove={onRemove} /> : null}</article>
}

export default CartItem