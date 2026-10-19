import axios from "axios";
import type { Response } from "express";

export interface ProductSnapshot {
    id: string;
    name: string;
    sku: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    isActive: boolean;
}

const productClient = axios.create({
    baseURL: process.env.PRODUCT_SERVICE_URL ?? "http://localhost:5003",
    timeout: 5000,
});

/** Fetches the canonical product record so the cart never trusts client prices. */
export const getProductSnapshot = async (productId: string): Promise<ProductSnapshot> => {
    const { data } = await productClient.get(`/${productId}`);
    return data.product as ProductSnapshot;
};

/** Maps axios errors to a friendly message handled by the error middleware. */
export const toFriendlyError = (error: unknown, fallback: string): Error => {
    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as { message?: string } | undefined;
        if (payload?.message) return new Error(payload.message);
        if (error.response?.status === 404) return new Error("Product not found");
    }
    if (error instanceof Error && error.message) return new Error(error.message);
    return new Error(fallback);
};

export type { Response };
