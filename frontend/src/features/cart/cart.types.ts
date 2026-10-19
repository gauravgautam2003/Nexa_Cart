export interface CartItem {
    productId: string;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    itemTotal: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
}
