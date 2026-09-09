import EmptyState from '../../../components/ui/EmptyState'
import type { Order } from '../orders.types'
import OrderCard from './OrderCard'

export function OrderList({ orders }: { orders: Order[] }) { return orders.length ? <div className="grid gap-4">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <EmptyState title="No orders yet" description="Your completed purchases will appear here." /> }
export default OrderList