import type { OrderItem as OrderItemType } from '../orders.types'

export function OrderItem({ item }: { item: OrderItemType }) { return <li className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 text-sm"><span>{item.name} <span className="text-slate-500">x{item.quantity}</span></span><span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span></li> }
export default OrderItem