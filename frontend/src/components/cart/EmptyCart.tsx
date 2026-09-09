import Link from 'next/link'
import EmptyState from '../ui/EmptyState'

export function EmptyCart() {
  return <EmptyState title="Your cart is empty" description="Add a few products and they will appear here." action={<Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/products">Browse products</Link>} />
}

export default EmptyCart