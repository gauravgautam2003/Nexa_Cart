import { api, compactParams } from "@/services/api";
import type { Product, ProductInput, ProductListParams, ProductListResponse } from "./products.types";

export const listProducts = async (params: ProductListParams = {}): Promise<ProductListResponse> => {
    const { data } = await api.get<{
        success: boolean;
        products: Product[];
        pagination: ProductListResponse["pagination"];
    }>("/products", { params: compactParams(params as Record<string, unknown>) });

    return { products: data.products ?? [], pagination: data.pagination };
};

export const getProduct = async (id: string): Promise<Product> => {
    const { data } = await api.get<{ success: boolean; product: Product }>(`/products/${id}`);
    return data.product;
};

export const getCategories = async (): Promise<string[]> => {
    const { data } = await api.get<{ success: boolean; categories: string[] }>("/products/categories");
    return data.categories ?? [];
};

/** Catalogue write (admin). */
export const createProduct = async (input: ProductInput): Promise<Product> => {
    const { data } = await api.post<{ success: boolean; product: Product }>("/products", input);
    return data.product;
};

export const updateProduct = async (id: string, input: Partial<ProductInput> & { isActive?: boolean }): Promise<Product> => {
    const { data } = await api.patch<{ success: boolean; product: Product }>(`/products/${id}`, input);
    return data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
};
