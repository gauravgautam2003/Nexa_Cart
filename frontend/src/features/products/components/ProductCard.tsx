import Link from 'next/link'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import type { Product } from '../products.types'
import { formatProductPrice } from '../products.utils'

export function ProductCard({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) {
  return <Card className="flex h-full flex-col overflow-hidden p-0"><div className="flex aspect-square items-center justify-center bg-slate-100">{product.imageUrl ? <img className="size-full object-cover" src={product.imageUrl} alt={product.name} /> : <span className="text-sm text-slate-400">No image</span>}</div><div className="flex flex-1 flex-col gap-3 p-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</p><Link className="mt-1 block font-bold text-slate-900 hover:underline" href={`/products/${product.id}`}>{product.name}</Link></div><p className="text-lg font-bold text-slate-900">{formatProductPrice(product.price)}</p><Button className="mt-auto w-full" onClick={() => onAdd?.(product)} disabled={!product.stock}>{product.stock ? 'Add to cart' : 'Out of stock'}</Button></div></Card>
}

export default ProductCard