import type { Cart } from './cart.types'

const endpoint = '/api/cart'
async function update<T>(path: string, body?: unknown): Promise<T> { const response = await fetch(`${endpoint}${path}`, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }); if (!response.ok) throw new Error('Unable to update cart.'); return response.json() as Promise<T> }
export const getCart = () => update<Cart>('')
export const addToCart = (productId: string, quantity = 1) => update<Cart>('/items', { productId, quantity })
export const updateCartItem = (itemId: string, quantity: number) => update<Cart>(`/items/${itemId}`, { quantity })
export const removeCartItem = (itemId: string) => update<Cart>(`/items/${itemId}`, { quantity: 0 })
