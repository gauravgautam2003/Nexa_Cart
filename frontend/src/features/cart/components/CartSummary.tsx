import Link from 'next/link'
import Card from '../../../components/ui/Card'
import type { Cart } from '../cart.types'

export function CartSummary({ cart }: { cart: Pick<Cart, 'subtotal' | 'shipping' | 'tax' | 'total'> }) {
  return <Card><h2 className="text-lg font-bold">Order summary</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>${cart.subtotal.toFixed(2)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>${cart.shipping.toFixed(2)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Tax</dt><dd>${cart.tax.toFixed(2)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 font-bold"><dt>Total</dt><dd>${cart.total.toFixed(2)}</dd></div></dl><Link className="mt-5 flex justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/checkout">Checkout</Link></Card>
}

export default CartSummary