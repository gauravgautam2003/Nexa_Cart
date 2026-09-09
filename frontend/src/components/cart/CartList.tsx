import CartItem, { type CartItemData } from './CartItem'
import EmptyCart from './EmptyCart'

type CartListProps = { items: CartItemData[]; onQuantityChange?: (id: CartItemData['id'], quantity: number) => void; onRemove?: (id: CartItemData['id']) => void }

export function CartList({ items, onQuantityChange, onRemove }: CartListProps) {
  if (!items.length) return <EmptyCart />
  return <div>{items.map((item) => <CartItem key={item.id} item={item} onQuantityChange={(quantity) => onQuantityChange?.(item.id, quantity)} onRemove={() => onRemove?.(item.id)} />)}</div>
}

export default CartList