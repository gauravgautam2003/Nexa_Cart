'use client'

import CartQuantity from '../../../components/cart/CartQuantity'
import RemoveCartItem from '../../../components/cart/RemoveCartItem'
import type { CartItem as CartItemType } from '../cart.types'

export function CartItem({ item, onQuantityChange, onRemove }: { item: CartItemType; onQuantityChange?: (quantity: number) => void; onRemove?: () => void }) {
  return <article className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-4"><div className="flex size-16 items-center justify-center rounded-lg bg-slate-100">{item.imageUrl ? <img className="size-full rounded-lg object-cover" src={item.imageUrl} alt="" /> : <span className="text-xs text-slate-400">No image</span>}</div><div className="min-w-40 flex-1"><h3 className="font-semibold text-slate-900">{item.name}</h3><p className="text-sm text-slate-500">${item.price.toFixed(2)}</p></div><CartQuantity value={item.quantity} onChange={(quantity) => onQuantityChange?.(quantity)} /><p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>{onRemove ? <RemoveCartItem onRemove={onRemove} /> : null}</article>
}

export default CartItem