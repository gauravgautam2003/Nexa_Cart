export type Product = { id: string; name: string; description?: string; price: number; category: string; imageUrl?: string; stock: number; rating?: number }
export type ProductFilters = { category?: string; minPrice?: number; maxPrice?: number; query?: string }
export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'name'
