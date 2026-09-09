import type { Product, ProductFilters } from './products.types'

const endpoint = '/api/products'
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))
  const response = await fetch(`${endpoint}?${params}`)
  if (!response.ok) throw new Error('Unable to load products.')
  return response.json() as Promise<Product[]>
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${endpoint}/${id}`)
  if (!response.ok) throw new Error('Product not found.')
  return response.json() as Promise<Product>
}
