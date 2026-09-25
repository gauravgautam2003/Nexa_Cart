import mongoose from "mongoose";
import Order from "../models/order.model.js";
import type { CreateOrderRequest, UpdateOrderStatusRequest, OrderResponse } from "../types/order.type.js";

const createOrderResponse = (order: InstanceType<typeof Order>): OrderResponse => ({

    id: order._id.toString(),
    userId: order.userId.toString(),
    items: order.items.map((item) => ({
        productId: item.productId.toString(),
        sku: item.sku,
        name: item.name,

        ...(item.image !== undefined && {
            image: item.image,
        }),

        price: item.price,
        quantity: item.quantity,
        itemTotal: item.price * item.quantity,
    })),

    shippingAddress: {
        fullName: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        addressLine1: order.shippingAddress.addressLine1,

        ...(order.shippingAddress.addressLine2 !== undefined && {
            addressLine2: order.shippingAddress.addressLine2,
        }),

        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
    },

    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    totalAmount: order.totalAmount,

    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,

    ...(order.paymentId !== undefined && {
        paymentId: order.paymentId,
    }),

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
});

export const createOrder = async (userId: string, data: CreateOrderRequest): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    if (!data.items || data.items.length === 0) {
        throw new Error("Order must contain at least one item");
    }

    for (const item of data.items) {
        if (!mongoose.isValidObjectId(item.productId)) {
            throw new Error("Invalid product ID");
        }

        if (item.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        if (item.price < 0) {
            throw new Error("Price cannot be negative");
        }
    }

    const shippingFee = data.shippingFee ?? 0;
    const discount = data.discount ?? 0;

    if (shippingFee < 0) {
        throw new Error("Shipping fee cannot be negative");
    }

    if (discount < 0) {
        throw new Error("Discount cannot be negative");
    }

    const subtotal = data.items.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const totalAmount = subtotal + shippingFee - discount;

    if (totalAmount < 0) {
        throw new Error("Invalid order total");
    }

    const order = await Order.create({

        userId: new mongoose.Types.ObjectId(userId),
        items: data.items.map((item) => ({
            productId: new mongoose.Types.ObjectId(
                item.productId
            ),
            sku: item.sku,
            name: item.name,

            ...(item.image !== undefined && {
                image: item.image,
            }),

            price: item.price,
            quantity: item.quantity,
        })),

        shippingAddress: {
            fullName: data.shippingAddress.fullName,
            phone: data.shippingAddress.phone,
            addressLine1:
                data.shippingAddress.addressLine1,

            ...(data.shippingAddress.addressLine2 !==
                undefined && {
                addressLine2:
                    data.shippingAddress.addressLine2,
            }),

            city: data.shippingAddress.city,
            state: data.shippingAddress.state,
            postalCode:
                data.shippingAddress.postalCode,
            country:
                data.shippingAddress.country ?? "India",
        },

        subtotal,
        shippingFee,
        discount,
        totalAmount,

        orderStatus: "pending",
        paymentStatus: "pending",

        paymentMethod: data.paymentMethod,
    });

    return createOrderResponse(order);
};

export const getOrderById = async (userId: string, orderId: string): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findOne({ _id: orderId, userId, });

    if (!order) {
        throw new Error("Order not found");
    }

    return createOrderResponse(order);
};

export const getUserOrders = async (userId: string): Promise<OrderResponse[]> => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const orders = await Order.find({ userId, }).sort({ createdAt: -1, });
    return orders.map(createOrderResponse);
};

export const updateOrderStatus = async (orderId: string, data: UpdateOrderStatusRequest): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.orderStatus === "delivered") {
        throw new Error("Delivered order cannot be updated");
    }

    if (order.orderStatus === "cancelled") {
        throw new Error("Cancelled order cannot be updated");
    }

    order.orderStatus = data.status;
    await order.save();

    return createOrderResponse(order);
};

export const cancelOrder = async (userId: string, orderId: string): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
        throw new Error("Order cannot be cancelled at this stage");
    }

    if (order.orderStatus === "cancelled") {
        throw new Error("Order is already cancelled");
    }

    order.orderStatus = "cancelled";
    await order.save();

    return createOrderResponse(order);
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: | "pending" | "paid" | "failed" | "refunded", paymentId?: string): Promise<OrderResponse> => {

    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.paymentStatus = paymentStatus;

    if (paymentId !== undefined) {
        order.paymentId = paymentId;
    }

    if (paymentStatus === "paid") {
        order.orderStatus = "confirmed";
    }

    await order.save();
    return createOrderResponse(order);
};