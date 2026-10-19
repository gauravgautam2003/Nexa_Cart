export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export type ProductSort =
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "rating"
    | "discount";

export interface ProductListParams {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: ProductSort;
    page?: number;
    limit?: number;
}

export interface ProductListResponse {
    products: Product[];
    pagination: Pagination;
}

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand?: string;
    images?: string[];
    stock?: number;
    sku: string;
}
