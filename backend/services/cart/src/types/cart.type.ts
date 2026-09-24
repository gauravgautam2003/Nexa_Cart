export interface AddToCartRequest {
    productId: string;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity?: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface CartItemResponse {
    productId: string;
    sku: string;
    name: string;
    image?: string | undefined;
    price: number;
    quantity: number;
    itemTotal: number;
}

export interface CartResponse {
    id: string;
    userId: string;
    items: CartItemResponse[];
    totalItems: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
}
