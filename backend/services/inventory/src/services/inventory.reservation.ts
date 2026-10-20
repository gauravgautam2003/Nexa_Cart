import mongoose from "mongoose";
import Inventory from "../models/inventory.model.js";
import type { IInventory } from "../models/inventory.model.js";
import type { InventoryResponse } from "../types/inventory.types.js";
import { createInventoryResponse } from "./inventory.service.js";
import { ensureInventory } from "./inventory.provision.js";

/**
 * Reserves stock for a pending order: available -> reserved.
 * Fails when there is not enough available stock.
 */
export const reserveStock = async (productId: string, quantity: number): Promise<InventoryResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    // A listing can be created and ordered before any warehouse row exists.
    await ensureInventory(productId);

    const inventory = await Inventory.findOneAndUpdate(
        { productId, availableStock: { $gte: quantity } },
        {
            $inc: {
                availableStock: -quantity,
                reservedStock: quantity,
            },
        },
        { new: true, runValidators: true },
    );

    if (!inventory) {
        const exists = await Inventory.findOne({ productId });
        if (!exists) {
            throw new Error("Inventory not found");
        }
        throw new Error("Insufficient stock");
    }

    return createInventoryResponse(inventory);
};

/**
 * Releases a reservation (order cancelled or payment failed):
 * reserved -> available.
 */
export const releaseStock = async (productId: string, quantity: number): Promise<InventoryResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await Inventory.findOneAndUpdate(
        { productId, reservedStock: { $gte: quantity } },
        {
            $inc: {
                availableStock: quantity,
                reservedStock: -quantity,
            },
        },
        { new: true, runValidators: true },
    );

    if (!inventory) {
        const exists = await Inventory.findOne({ productId });
        if (!exists) {
            throw new Error("Inventory not found");
        }
        throw new Error("No reserved stock to release");
    }

    return createInventoryResponse(inventory);
};

/**
 * Confirms a reservation after successful payment:
 * reserved -> sold (stock leaves the warehouse).
 */
export const confirmStock = async (productId: string, quantity: number): Promise<InventoryResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await Inventory.findOneAndUpdate(
        { productId, reservedStock: { $gte: quantity } },
        {
            $inc: {
                reservedStock: -quantity,
                soldStock: quantity,
            },
        },
        { new: true, runValidators: true },
    );

    if (!inventory) {
        const exists = await Inventory.findOne({ productId });
        if (!exists) {
            throw new Error("Inventory not found");
        }
        throw new Error("No reserved stock to confirm");
    }

    return createInventoryResponse(inventory);
};
