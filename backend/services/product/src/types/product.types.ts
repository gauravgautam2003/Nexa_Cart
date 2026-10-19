export interface CreateProductRequest {
    name: string,
    description: string,
    price: number,
    discountPrice?: number,
    category: string,
    brand?: string,
    images?: string[];
    stock?: number,
    sku: string, // stock keeping unit
};

export interface UpdateProductRequest {
    name?: string,
    description?: string,
    price?: number,
    discountPrice?: number,
    category?: string,
    brand?: string,
    images?: string[];
    stock?: number,
    sku?: string, // stock keeping unit
    isActive?: boolean
}

export type ProductSort =
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "rating"
    | "discount";

export interface ProductQuery {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sort?: ProductSort;
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface ProductResponse {
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
    createdAt: Date;
    updatedAt: Date;
}
