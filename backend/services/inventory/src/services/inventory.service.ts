import Inventory from "../models/inventory.model.js";
import type { IInventory } from "../models/inventory.model.js";
import type { CreateInventoryRequest, UpdateInventoryRequest, AdjustStockRequest, InventoryResponse } from "../types/inventory.types.js";

export const createInventoryResponse = (inventory: IInventory): InventoryResponse => ({
    id: inventory._id.toString(),
    productId: inventory.productId.toString(),
    sku: inventory.sku,
    availableStock: inventory.availableStock,
    reservedStock: inventory.reservedStock,
    soldStock: inventory.soldStock,
    lowStockThreshold: inventory.lowStockThreshold,
    isLowStock: inventory.availableStock <= inventory.lowStockThreshold,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
})

export const createInventory = async (data: CreateInventoryRequest): Promise<InventoryResponse> => {

    const existingProduct = await Inventory.findOne({ productId: data.productId });

    if (existingProduct) {
        throw new Error("Inventory already exists for this product");
    }

    const existingSku = await Inventory.findOne({ sku: data.sku });

    if (existingSku) {
        throw new Error("SKU already exists");
    }

    const inventory = await Inventory.create({
        productId: data.productId,
        sku: data.sku,
        availableStock: data.availableStock ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? 5,
    });

    return createInventoryResponse(inventory);

}
export const getInventoryByProductId = async (productId: string): Promise<InventoryResponse> => {
    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return createInventoryResponse(inventory);
};

export const getInventoryBySku = async (sku: string): Promise<InventoryResponse> => {
    const inventory = await Inventory.findOne({ sku: sku.toUpperCase() });

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return createInventoryResponse(inventory);
};

export const updateInventory = async (productId: string, data: UpdateInventoryRequest): Promise<InventoryResponse> => {
    const inventory = await Inventory.findOneAndUpdate(
        { productId },
        { $set: data },
        { new: true, runValidators: true }
    );

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return createInventoryResponse(inventory);
};

export const addStock = async (productId: string, data: AdjustStockRequest): Promise<InventoryResponse> => {
    if (data.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await Inventory.findOneAndUpdate(
        { productId },
        {
            $inc: {
                availableStock: data.quantity,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return createInventoryResponse(inventory);
};

export const removeStock = async (productId: string, data: AdjustStockRequest): Promise<InventoryResponse> => {
    if (data.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const inventory = await Inventory.findOneAndUpdate(
        {
            productId,
            availableStock: { $gte: data.quantity },
        },
        {
            $inc: {
                availableStock: -data.quantity,
                soldStock: data.quantity,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!inventory) {
        throw new Error("Insufficient stock or inventory not found");
    }

    return createInventoryResponse(inventory);
};