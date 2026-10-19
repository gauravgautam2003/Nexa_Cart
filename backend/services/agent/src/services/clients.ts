import axios from "axios";
import type { InventorySnapshot, ProductSnapshot } from "../types/agent.types.js";

const productClient = axios.create({
    baseURL: process.env.PRODUCT_SERVICE_URL ?? "http://localhost:5003",
    timeout: 5000,
});

const inventoryClient = axios.create({
    baseURL: process.env.INVENTORY_SERVICE_URL ?? "http://localhost:5007",
    timeout: 5000,
});

/** Reads the live product listing from the product service. */
export const fetchProduct = async (productId: string): Promise<ProductSnapshot | null> => {
    try {
        const response = await productClient.get(`/${productId}`);
        const product = (response.data as { product?: ProductSnapshot }).product;
        return product ?? null;
    } catch {
        return null;
    }
};

/** Reads the live stock record from the inventory service (null when absent). */
export const fetchInventory = async (productId: string): Promise<InventorySnapshot | null> => {
    try {
        const response = await inventoryClient.get(`/product/${productId}`);
        const inventory = (response.data as { inventory?: InventorySnapshot | null }).inventory;
        return inventory ?? null;
    } catch {
        return null;
    }
};
