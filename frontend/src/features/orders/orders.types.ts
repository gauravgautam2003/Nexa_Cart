export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type OrderItem = { id: string; productId: string; name: string; quantity: number; price: number; imageUrl?: string }
export type Order = { id: string; createdAt: string; status: OrderStatus; items: OrderItem[]; total: number; shippingAddress: string }
