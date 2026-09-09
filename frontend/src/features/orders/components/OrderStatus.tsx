import Badge from '../../../components/ui/Badge'
import type { OrderStatus } from '../orders.types'
import { getOrderStatusLabel } from '../orders.utils'

export function OrderStatus({ status }: { status: OrderStatus }) { const tone = status === 'delivered' ? 'success' : status === 'cancelled' ? 'danger' : status === 'pending' ? 'warning' : 'neutral'; return <Badge tone={tone}>{getOrderStatusLabel(status)}</Badge> }
export default OrderStatus