'use client'

import Input from '../../../components/ui/Input'

export function ProductSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input id="product-search" label="Search products" type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by name..." />
}

export default ProductSearch