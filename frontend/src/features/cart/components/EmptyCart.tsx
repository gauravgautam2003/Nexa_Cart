import Link from 'next/link'
import EmptyState from '../../../components/ui/EmptyState'

export function EmptyCart() { return <EmptyState title="Your cart is empty" description="Add products to your cart to see them here." action={<Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/products">Browse products</Link>} /> }
export default EmptyCart
