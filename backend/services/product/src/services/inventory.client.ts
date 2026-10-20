import axios from "axios";

const inventoryClient = axios.create({
    baseURL: process.env.INVENTORY_SERVICE_URL ?? "http://localhost:5007",
    timeout: 10000,
});

/**
 * Mirrors the catalogue stock into the inventory service after a product is
 * created or its stock is edited — fire-and-forget, like the NexaGuard
 * trigger: a warehouse outage never blocks product management, and the
 * agent's inventory-sync check keeps reporting real drift.
 */
export const syncInventory = (productId: string, sku: string, stock: number): void => {
    inventoryClient
        .post(`/product/${productId}/sync`, { sku, stock })
        .then(() => {
            console.log(`Inventory synced for product ${productId}`);
        })
        .catch((error: unknown) => {
            console.error(`Inventory sync failed for product ${productId}:`, {
                error: error instanceof Error ? error.message : error,
            });
        });
};
