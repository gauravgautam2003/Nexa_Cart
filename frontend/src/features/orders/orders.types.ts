export interface ShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
}

export interface OrderItem {
    productId: string;
    sku: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    itemTotal: number;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cod" | "razorpay";

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderInput {
    items: {
        productId: string;
        sku: string;
        name: string;
        image?: string;
        price: number;
        quantity: number;
    }[];
    shippingAddress: ShippingAddress;
    shippingFee?: number;
    discount?: number;
    paymentMethod: PaymentMethod;
}
