import type { Cart, CartItem } from './cart.types'

export function calculateSubtotal(items: CartItem[]): number { return items.reduce((total, item) => total + item.price * item.quantity, 0) }
export function calculateCartTotal(cart: Pick<Cart, 'subtotal' | 'shipping' | 'tax'>): number { return cart.subtotal + cart.shipping + cart.tax }
export function getCartItemCount(items: CartItem[]): number { return items.reduce((count, item) => count + item.quantity, 0) }
