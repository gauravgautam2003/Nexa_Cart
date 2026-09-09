import Select from '../../../components/ui/Select'
import type { ProductSort } from '../products.types'

export function ProductSort({ value, onChange }: { value: ProductSort; onChange: (value: ProductSort) => void }) {
  return <Select id="product-sort" label="Sort by" value={value} onChange={(event) => onChange(event.target.value as ProductSort)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></Select>
}

export default ProductSort