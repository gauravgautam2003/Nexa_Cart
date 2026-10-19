import mongoose from "mongoose";
import Order from "../models/order.model.js";
import { reserveInventory, releaseInventory, confirmInventory } from "./inventory.client.js";
import { sendOrderNotification } from "./notification.client.js";
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
        (total, item) => total + item.price * item.quantity, 0
    );

    const totalAmount = subtotal + shippingFee - discount;

    if (totalAmount < 0) {
        throw new Error("Invalid order total");
    }

    const reservedItems: Array<{
        productId: string;
        quantity: number;
    }> = [];

    try {
        for (const item of data.items) {
            await reserveInventory(item.productId, item.quantity);

            reservedItems.push({
                productId: item.productId,
                quantity: item.quantity,
            });
        }

        const order = await Order.create({

            userId: new mongoose.Types.ObjectId(userId),
            items: data.items.map((item) => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                sku: item.sku,
                name: item.name,

                ...(item.image !== undefined && { image: item.image, }),

                price: item.price,
                quantity: item.quantity,
            })),

            shippingAddress: {
                fullName: data.shippingAddress.fullName,
                phone: data.shippingAddress.phone,
                addressLine1: data.shippingAddress.addressLine1,

                ...(data.shippingAddress.addressLine2 !== undefined && {
                    addressLine2: data.shippingAddress.addressLine2,
                }),

                city: data.shippingAddress.city,
                state: data.shippingAddress.state,
                postalCode: data.shippingAddress.postalCode,
                country: data.shippingAddress.country ?? "India",
            },

            subtotal,
            shippingFee,
            discount,
            totalAmount,

            orderStatus: "pending",
            paymentStatus: "pending",

            paymentMethod: data.paymentMethod,
        });

        await sendOrderNotification({
            userId,
            title: "Order placed",
            message: `Your order ${order._id.toString()} has been placed. Total: ₹${totalAmount.toFixed(2)}.`,
            metadata: { orderId: order._id.toString(), event: "order.placed" },
        });

        return createOrderResponse(order);
    } catch (error) {

        for (const item of [...reservedItems].reverse()) {
            try {
                await releaseInventory(item.productId, item.quantity);
            } catch (releaseError) {
                console.error("Inventory rollback failed:", {
                    item,
                    releaseError,
                });
            }
        }

        throw error;
    }
};

export const confirmOrderInventory = async (orderId: string, userId: string): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.paymentStatus !== "paid") {
        throw new Error("Payment must be verified before confirming inventory");
    }

    if (order.orderStatus === "cancelled") {
        throw new Error("Cannot confirm inventory for a cancelled order");
    }

    if (order.inventoryConfirmed) {
        return createOrderResponse(order);
    }

    for (const item of order.items) {
        await confirmInventory(item.productId.toString(), item.quantity);
    }

    order.orderStatus = "confirmed";
    order.inventoryConfirmed = true;
    await order.save();

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

export const getUserOrders = async (userId: string, includeAll = false): Promise<OrderResponse[]> => {
    if (!includeAll && !mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid user ID");
    }

    // Admins (includeAll) see every order; shoppers see only their own.
    const filter = includeAll ? {} : { userId, };
    const orders = await Order.find(filter).sort({ createdAt: -1, });
    return orders.map(createOrderResponse);
};

export const updateOrderStatus = async (orderId: string, userId: string, data: UpdateOrderStatusRequest, isAdmin = false): Promise<OrderResponse> => {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findOne({ _id: orderId, ...(!isAdmin && mongoose.isValidObjectId(userId) && { userId }) });

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

    /*
     * A delivered cash-on-delivery order settles the payment and converts
     * the reserved stock into a completed sale.
     */
    if (data.status === "delivered" && order.paymentMethod === "cod" && !order.inventoryConfirmed) {
        for (const item of order.items) {
            await confirmInventory(item.productId.toString(), item.quantity);
        }
        order.inventoryConfirmed = true;
        order.paymentStatus = "paid";
    }

    await order.save();

    const statusMessages: Record<string, string> = {
        confirmed: "has been confirmed",
        processing: "is being prepared",
        shipped: "has been shipped",
        delivered: "has been delivered",
        cancelled: "has been cancelled",
    };

    await sendOrderNotification({
        userId: order.userId.toString(),
        title: `Order ${data.status}`,
        message: `Your order ${order._id.toString()} ${statusMessages[data.status] ?? `is now ${data.status}`}.`,
        metadata: { orderId: order._id.toString(), event: `order.${data.status}` },
    });

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

    /*
     * Unpaid orders still hold reserved stock; give it back so other
     * shoppers can buy it again.
     */
    if (order.paymentStatus !== "paid" && !order.inventoryConfirmed) {
        for (const item of order.items) {
            try {
                await releaseInventory(item.productId.toString(), item.quantity);
            } catch (releaseError) {
                console.error("Inventory release failed during cancel:", {
                    orderId,
                    item: item.productId.toString(),
                    releaseError,
                });
            }
        }
    }

    await order.save();

    await sendOrderNotification({
        userId,
        title: "Order cancelled",
        message: `Your order ${order._id.toString()} has been cancelled.`,
        metadata: { orderId: order._id.toString(), event: "order.cancelled" },
    });

    return createOrderResponse(order);
};

export const updatePaymentStatus = async (
    orderId: string,
    userId: string,
    paymentStatus: "pending" | "paid" | "failed" | "refunded",
    paymentId?: string,
): Promise<OrderResponse> => {

    if (!mongoose.isValidObjectId(orderId)) {
        throw new Error("Invalid order ID");
    }

    const order = await Order.findOne({ _id: orderId, ...(mongoose.isValidObjectId(userId) && { userId }) });

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
