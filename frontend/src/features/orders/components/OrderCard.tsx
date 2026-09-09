import Link from 'next/link'
import Card from '../../../components/ui/Card'
import type { Order } from '../orders.types'
import { formatOrderDate, formatOrderNumber } from '../orders.utils'
import OrderStatus from './OrderStatus'

export function OrderCard({ order }: { order: Order }) { return <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><Link className="font-bold text-slate-900 hover:underline" href={`/orders/${order.id}`}>{formatOrderNumber(order.id)}</Link><p className="mt-1 text-sm text-slate-500">{formatOrderDate(order.createdAt)}</p></div><OrderStatus status={order.status} /></div><div className="mt-4 flex items-center justify-between text-sm"><span className="text-slate-500">{order.items.length} item{order.items.length === 1 ? '' : 's'}</span><strong>${order.total.toFixed(2)}</strong></div></Card> }
export default OrderCard