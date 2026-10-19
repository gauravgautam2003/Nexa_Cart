import axios from "axios";

const inventoryClient = axios.create({
    baseURL: process.env.INVENTORY_SERVICE_URL ?? "http://localhost:5007",
    timeout: 5000,
});

/** Reserves stock for every item while an order is being placed. */
export const reserveInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/product/${productId}/reserve`, {
        quantity
    });
    return data;
};

/** Gives reserved stock back when an order is cancelled or payment fails. */
export const releaseInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/product/${productId}/release`, {
        quantity
    });

    return data;
};

/** Turns a reservation into a sale once the order is paid. */
export const confirmInventory = async (productId: string, quantity: number) => {
    const { data } = await inventoryClient.post(`/product/${productId}/confirm`, {
        quantity
    });

    return data;
};
