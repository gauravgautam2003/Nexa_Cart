import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import type { ICart } from "../models/cart.model.js";
import type { AddToCartRequest, UpdateCartItemRequest, CartResponse } from "../types/cart.type.js";

const createCartResponse = (cart: ICart): CartResponse => ({
    id: cart._id.toString(),
    userId: cart.userId.toString(),

    items: cart.items.map((item) => ({
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

    totalItems: cart.totalItems,
    subtotal: cart.subtotal,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
});


const calculateCartTotals = (items: { price: number; quantity: number }[]): {
    totalItems: number; subtotal: number} => {

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return {totalItems, subtotal};
};

export const getCart = async (userId: string): Promise<CartResponse> => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({
            userId: new mongoose.Types.ObjectId(userId),
            items: [],
            totalItems: 0,
            subtotal: 0,
        });
    }

    return createCartResponse(cart);
};

export const addToCart = async (userId: string, data: AddToCartRequest): Promise<CartResponse> => {
    if (!mongoose.isValidObjectId(data.productId)) {
        throw new Error("Invalid product ID");
    }

    if (data.quantity !== undefined && data.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    if (data.price < 0) {
        throw new Error("Price cannot be negative");
    }

    const quantity = data.quantity ?? 1;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({
            userId: new mongoose.Types.ObjectId(userId),
            items: [
                {
                    productId: new mongoose.Types.ObjectId(data.productId),
                    sku: data.sku,
                    name: data.name,
                    ...(data.image !== undefined && {
                        image: data.image,
                    }),
                    price: data.price,
                    quantity,
                },
            ],
            totalItems: quantity,
            subtotal: data.price * quantity,
        });

        return createCartResponse(cart);
    }

    const existingItem = cart.items.find(
        (item) =>
            item.productId.toString() === data.productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = data.price;
        existingItem.name = data.name;
        existingItem.sku = data.sku;

        if (data.image !== undefined) {
            existingItem.image = data.image;
        } else {
            throw new Error("Image can not be undefined when updating an existing cart item");
        }
    } else {
        cart.items.push({
            productId: new mongoose.Types.ObjectId(data.productId),
            sku: data.sku,
            name: data.name,
            ...(data.image !== undefined && {
                image: data.image,
            }),
            price: data.price,
            quantity,
        });
    }

    const totals = calculateCartTotals(cart.items);

    cart.totalItems = totals.totalItems;
    cart.subtotal = totals.subtotal;

    await cart.save();

    return createCartResponse(cart);
};

export const updateCartItem = async (userId: string, productId: string, data: UpdateCartItemRequest): Promise<CartResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    if (data.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.find(
        (cartItem) => cartItem.productId.toString() === productId
    );

    if (!item) {
        throw new Error("Product not found in cart");
    }

    item.quantity = data.quantity;

    const totals = calculateCartTotals(cart.items);

    cart.totalItems = totals.totalItems;
    cart.subtotal = totals.subtotal;

    await cart.save();

    return createCartResponse(cart);
};

export const removeFromCart = async (userId: string, productId: string): Promise<CartResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const itemExists = cart.items.some(
        (item) => item.productId.toString() === productId
    );

    if (!itemExists) {
        throw new Error("Product not found in cart");
    }

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );

    const totals = calculateCartTotals(cart.items);

    cart.totalItems = totals.totalItems;
    cart.subtotal = totals.subtotal;

    await cart.save();

    return createCartResponse(cart);
};

export const clearCart = async (userId: string): Promise<void> => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.subtotal = 0;

    await cart.save();
};