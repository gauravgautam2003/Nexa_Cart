import type { Order } from './orders.types'

const endpoint = '/api/orders'
export async function getOrders(): Promise<Order[]> { const response = await fetch(endpoint); if (!response.ok) throw new Error('Unable to load orders.'); return response.json() as Promise<Order[]> }
export async function getOrder(id: string): Promise<Order> { const response = await fetch(`${endpoint}/${id}`); if (!response.ok) throw new Error('Order not found.'); return response.json() as Promise<Order> }
