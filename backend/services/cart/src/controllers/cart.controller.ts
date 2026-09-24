import type { Request, Response, NextFunction } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../services/cart.service.js";

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const cart = await getCart(userId);

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

export const add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const cart = await addToCart(
            userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const cart = await updateCartItem(
            userId,
            productId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const { productId } = req.params;

        if (!productId || Array.isArray(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
            return;
        }

        const cart = await removeFromCart(
            userId,
            productId
        );

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });
    } catch (error) {
        next(error);
    }
};

export const clear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        await clearCart(userId);

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        });
    } catch (error) {
        next(error);
    }
};