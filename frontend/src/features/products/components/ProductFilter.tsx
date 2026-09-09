import Select from '../../../components/ui/Select'

export function ProductFilter({ categories, value, onChange }: { categories: string[]; value?: string; onChange: (category: string) => void }) {
  return <Select id="product-category" label="Category" value={value ?? ''} onChange={(event) => onChange(event.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</Select>
}

export default ProductFilter