export type CartItem = { id: string; productId: string; name: string; price: number; quantity: number; imageUrl?: string }
export type Cart = { items: CartItem[]; subtotal: number; shipping: number; tax: number; total: number }
