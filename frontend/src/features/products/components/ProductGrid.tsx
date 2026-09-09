import EmptyState from '../../../components/ui/EmptyState'
import type { Product } from '../products.types'
import ProductCard from './ProductCard'

export function ProductGrid({ products, onAdd }: { products: Product[]; onAdd?: (product: Product) => void }) {
  if (!products.length) return <EmptyState title="No products found" description="Try adjusting your search or filters." />
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
}

export default ProductGrid