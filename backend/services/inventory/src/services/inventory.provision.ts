import axios from "axios";
import mongoose from "mongoose";
import Inventory from "../models/inventory.model.js";
import type { IInventory } from "../models/inventory.model.js";

const productClient = axios.create({
    baseURL: process.env.PRODUCT_SERVICE_URL ?? "http://localhost:5003",
    timeout: 5000,
});

interface CatalogueProduct {
    id: string;
    sku: string;
    stock: number;
}

const fetchCatalogueProduct = async (productId: string): Promise<CatalogueProduct | null> => {
    try {
        const { data } = await productClient.get<{ success: boolean; product?: CatalogueProduct }>(
            `/products/${productId}`,
        );
        const product = data?.product;

        if (!product?.sku) return null;

        return { id: product.id, sku: product.sku, stock: Number(product.stock ?? 0) };
    } catch {
        return null;
    }
};

/**
 * Returns the warehouse row for a product, creating it from the live
 * catalogue listing the first time the product is seen. Products created
 * after seeding become orderable without a manually created inventory row.
 */
export const ensureInventory = async (productId: string): Promise<IInventory | null> => {
    if (!mongoose.isValidObjectId(productId)) return null;

    const existing = await Inventory.findOne({ productId });
    if (existing) return existing;

    const product = await fetchCatalogueProduct(productId);
    if (!product) return null;

    try {
        return await Inventory.create({
            productId: product.id,
            sku: product.sku,
            availableStock: Math.max(0, Math.floor(product.stock)),
        });
    } catch {
        // A concurrent request provisioned the same product first.
        return Inventory.findOne({ productId });
    }
};

/**
 * Mirrors a catalogue stock value into the warehouse row. The catalogue
 * number is the total units sellable, so anything already reserved stays
 * deducted; sold history is never rewritten.
 */
export const syncFromCatalogue = async (
    productId: string,
    stock: number,
    sku?: string,
): Promise<IInventory | null> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    const target = Math.max(0, Math.floor(stock));
    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
        const product = await fetchCatalogueProduct(productId);
        const resolvedSku = sku ?? product?.sku;

        if (!resolvedSku) {
            throw new Error("Inventory not found");
        }

        return Inventory.create({
            productId,
            sku: resolvedSku,
            availableStock: target,
        });
    }

    inventory.availableStock = Math.max(0, target - inventory.reservedStock);
    if (sku && inventory.sku !== sku.toUpperCase()) {
        inventory.sku = sku;
    }
    await inventory.save();

    return inventory;
};
