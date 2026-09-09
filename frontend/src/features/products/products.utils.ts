import type { Product, ProductSort } from './products.types'

export function formatProductPrice(price: number, currency = '$'): string { return `${currency}${price.toFixed(2)}` }
export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  return [...products].sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : 0)
}
export function filterProducts(products: Product[], query: string): Product[] { const normalized = query.trim().toLowerCase(); return normalized ? products.filter((product) => `${product.name} ${product.description ?? ''}`.toLowerCase().includes(normalized)) : products }
