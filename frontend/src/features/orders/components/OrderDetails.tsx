import Card from '../../../components/ui/Card'
import type { Order } from '../orders.types'
import { formatOrderDate, formatOrderNumber } from '../orders.utils'
import OrderItem from './OrderItem'
import OrderStatus from './OrderStatus'

export function OrderDetails({ order }: { order: Order }) { return <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-bold">Order {formatOrderNumber(order.id)}</h1><p className="text-sm text-slate-500">Placed {formatOrderDate(order.createdAt)}</p></div><OrderStatus status={order.status} /></div><ul className="mt-5">{order.items.map((item) => <OrderItem key={item.id} item={item} />)}</ul><div className="mt-5 flex justify-between border-t border-slate-200 pt-4 font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div><p className="mt-4 text-sm text-slate-600">Shipping to: {order.shippingAddress}</p></Card> }
export default OrderDetails