import type { Request, Response, NextFunction } from "express";
import { reserveStock, releaseStock, confirmStock } from "../services/inventory.reservation.js";

type Action = "reserve" | "release" | "confirm";

const runAction = (action: Action) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { productId } = req.params;
        const quantity = Number((req.body as { quantity?: unknown } | undefined)?.quantity);

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({ success: false, message: "Invalid product ID" });
            return;
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            res.status(400).json({ success: false, message: "Quantity must be greater than zero" });
            return;
        }

        const result =
            action === "reserve"
                ? await reserveStock(productId, quantity)
                : action === "release"
                    ? await releaseStock(productId, quantity)
                    : await confirmStock(productId, quantity);

        res.status(200).json({
            success: true,
            message: `Stock ${action}d successfully`,
            inventory: result,
        });
    } catch (error) {
        next(error);
    }
};

export const reserve = runAction("reserve");
export const release = runAction("release");
export const confirm = runAction("confirm");
