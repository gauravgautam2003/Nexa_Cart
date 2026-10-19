import type { NextFunction, Request, Response } from "express";
import { getProductSnapshot, toFriendlyError } from "../services/product.client.js";

interface CartItemBody {
    productId?: unknown;
    quantity?: unknown;
}

/**
 * Replaces the client-supplied item with the canonical product data
 * (name, sku, effective price, image) fetched from the product service.
 * The cart therefore always bills the price the catalog currently has.
 */
export const enrichCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = req.body as CartItemBody;

        if (typeof body.productId !== "string" || !body.productId) {
            res.status(400).json({ success: false, message: "productId is required" });
            return;
        }

        const quantity = typeof body.quantity === "number" ? body.quantity : 1;

        if (quantity <= 0) {
            res.status(400).json({ success: false, message: "Quantity must be greater than zero" });
            return;
        }

        const product = await getProductSnapshot(body.productId);
        const price = product.discountPrice ?? product.price;

        req.body = {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            image: product.images[0],
            price,
            quantity,
        };

        next();
    } catch (error) {
        const friendly = toFriendlyError(error, "Product service is unavailable");
        res.status(friendly.message === "Product not found" ? 404 : 502).json({
            success: false,
            message: friendly.message,
        });
    }
};
