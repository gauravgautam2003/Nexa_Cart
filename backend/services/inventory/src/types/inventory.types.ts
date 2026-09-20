export interface CreateInventoryRequest {
    productId: string;
    sku: string;
    availableStock?: number;
    lowStockThreshold?: number;
}

export interface UpdateInventoryRequest {
    availableStock?: number;
    lowStockThreshold?: number;
}

export interface AdjustStockRequest {
    quantity: number;
}

export interface InventoryResponse {
    id: string;
    productId: string;
    sku: string;
    availableStock: number;
    reservedStock: number;
    soldStock: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}