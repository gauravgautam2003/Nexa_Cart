import { api } from "@/services/api";
import type { Cart } from "./cart.types";

interface CartEnvelope {
    success: boolean;
    message?: string;
    cart?: Cart;
}

export const getCart = async (): Promise<Cart> => {
    const { data } = await api.get<CartEnvelope>("/cart");
    return data.cart ?? { id: "", userId: "", items: [], totalItems: 0, subtotal: 0 };
};

export const addToCart = async (productId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post<CartEnvelope>("/cart/items", { productId, quantity });
    return data.cart ?? (await getCart());
};

export const updateCartItem = async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.patch<CartEnvelope>(`/cart/items/${productId}`, { quantity });
    return data.cart ?? (await getCart());
};

export const removeCartItem = async (productId: string): Promise<Cart> => {
    const { data } = await api.delete<CartEnvelope>(`/cart/items/${productId}`);
    return data.cart ?? (await getCart());
};

export const clearCart = async (): Promise<void> => {
    await api.delete("/cart/clear");
};
