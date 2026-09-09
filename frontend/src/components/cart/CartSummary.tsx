import Link from 'next/link'
import Card from '../ui/Card'

type CartSummaryProps = { subtotal: number; shipping?: number; tax?: number; currency?: string; checkoutHref?: string }

export function CartSummary({ subtotal, shipping = 0, tax = 0, currency = '$', checkoutHref = '/checkout' }: CartSummaryProps) {
  const total = subtotal + shipping + tax
  return <Card><h2 className="text-lg font-bold text-slate-900">Order summary</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{currency}{subtotal.toFixed(2)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>{shipping ? `${currency}${shipping.toFixed(2)}` : 'Free'}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Tax</dt><dd>{currency}{tax.toFixed(2)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><dt>Total</dt><dd>{currency}{total.toFixed(2)}</dd></div></dl><Link className="mt-5 flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" href={checkoutHref}>Proceed to checkout</Link></Card>
}

export default CartSummary