export interface ShippingAddressRequest {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
}

export interface CreateOrderItemRequest {
    productId: string;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface CreateOrderRequest {
    items: CreateOrderItemRequest[];
    shippingAddress: ShippingAddressRequest;
    shippingFee?: number;
    discount?: number;
    paymentMethod: "cod" | "razorpay";
}

export interface UpdateOrderStatusRequest {
    status:
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}

export interface OrderItemResponse {
    productId: string;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    itemTotal: number;
}

export interface OrderResponse {
    id: string;
    userId: string;

    items: OrderItemResponse[];

    shippingAddress: ShippingAddressRequest;

    subtotal: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;

    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentId?: string;

    createdAt: Date;
    updatedAt: Date;
}