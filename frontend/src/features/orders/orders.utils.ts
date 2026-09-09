import type { Order, OrderStatus } from './orders.types'

export function formatOrderNumber(id: string): string { return `#${id.slice(-8).toUpperCase()}` }
export function formatOrderDate(date: string): string { return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date)) }
export function getOrderStatusLabel(status: OrderStatus): string { return status.charAt(0).toUpperCase() + status.slice(1) }
export function isCompleted(order: Order): boolean { return order.status === 'delivered' }
