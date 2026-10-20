import type { Request, Response, NextFunction } from "express";

import {
    createInventory,
    createInventoryResponse,
    getInventoryByProductId,
    getInventoryBySku,
    updateInventory,
    addStock,
    removeStock,
} from "../services/inventory.service.js";
import { syncFromCatalogue } from "../services/inventory.provision.js";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const inventory = await createInventory(req.body);

        res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

export const getByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const inventory = await getInventoryByProductId(productId);

        res.status(200).json({
            success: true,
            message: "Inventory fetched successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

export const getBySku = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { sku } = req.params;

        if (!sku || Array.isArray(sku)) {
            res.status(400).json({
                success: false,
                message: "Invalid SKU",
            });
            return;
        }

        const inventory = await getInventoryBySku(sku);

        res.status(200).json({
            success: true,
            message: "Inventory fetched successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const inventory = await updateInventory(
            productId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const inventory = await addStock(
            productId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Stock added successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const inventory = await removeStock(
            productId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Stock removed successfully",
            inventory,
        });
    } catch (error) {
        next(error);
    }
};

/** Mirrors a catalogue stock edit (or a new listing) into this service. */
export const sync = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const stock = Number(req.body?.stock);

        if (!Number.isFinite(stock) || stock < 0) {
            res.status(400).json({
                success: false,
                message: "Stock must be a non-negative number",
            });
            return;
        }

        const sku = typeof req.body?.sku === "string" ? req.body.sku : undefined;
        const inventory = await syncFromCatalogue(productId, stock, sku);

        if (!inventory) {
            res.status(404).json({
                success: false,
                message: "Inventory not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Inventory synced with the catalogue",
            inventory: createInventoryResponse(inventory),
        });
    } catch (error) {
        next(error);
    }
};
