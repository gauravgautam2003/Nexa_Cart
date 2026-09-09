import EmptyCart from './EmptyCart'
import CartItem from './CartItem'
import type { CartItem as CartItemType } from '../cart.types'

export function CartList({ items, onQuantityChange, onRemove }: { items: CartItemType[]; onQuantityChange?: (id: string, quantity: number) => void; onRemove?: (id: string) => void }) {
  if (!items.length) return <EmptyCart />
  return <div>{items.map((item) => <CartItem key={item.id} item={item} onQuantityChange={(quantity) => onQuantityChange?.(item.id, quantity)} onRemove={() => onRemove?.(item.id)} />)}</div>
}

export default CartList