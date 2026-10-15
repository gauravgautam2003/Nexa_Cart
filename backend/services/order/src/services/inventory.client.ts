import axios from "axios";

const inventoryClient = axios.create({
    baseURL: process.env.INVENTORY_SERVICE_URL ?? "http://localhost:5007",
    timeout: 5000,
});

export const reserveInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/api/inventory/product/${productId}/reserve`, {
        quantity
    });
    return data;
};

export const releaseInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/api/inventory/product/${productId}/release`, {
        quantity
    });

    return data;
};

export const confirmInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/api/inventory/product/${productId}/confirm`, {
        quantity
    });

    return data;
};