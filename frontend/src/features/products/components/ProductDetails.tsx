import Button from '../../../components/ui/Button'
import type { Product } from '../products.types'
import { formatProductPrice } from '../products.utils'

export function ProductDetails({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) {
  return <article className="grid gap-8 md:grid-cols-2"><div className="flex aspect-square items-center justify-center rounded-xl bg-slate-100">{product.imageUrl ? <img className="size-full rounded-xl object-cover" src={product.imageUrl} alt={product.name} /> : <span className="text-sm text-slate-400">No image</span>}</div><div className="self-center"><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.category}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1><p className="mt-4 text-2xl font-bold text-slate-900">{formatProductPrice(product.price)}</p><p className="mt-5 leading-7 text-slate-600">{product.description || 'A carefully selected product for your everyday needs.'}</p><Button className="mt-7" onClick={() => onAdd?.(product)} disabled={!product.stock}>{product.stock ? 'Add to cart' : 'Out of stock'}</Button></div></article>
}

export default ProductDetails