import type { NextFunction, Request, Response } from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    listProducts,
    updateProduct,
} from "../services/product.service.js";

const getProductId = (req: Request, res: Response): string | undefined => {
    const { id } = req.params;

    if (typeof id !== "string") {
        res.status(400).json({ success: false, message: "Product id is required" });
        return undefined;
    }

    return id;
};

/** Creates a product for the user identified by the gateway header. */
export const createProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const createdBy = req.header("x-user-id");

        if (!createdBy) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const product = await createProduct(req.body, createdBy);
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

/** Returns active products with optional category and text filters. */
export const listProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: { category?: string; search?: string } = {};
        if (typeof req.query.category === "string") filters.category = req.query.category;
        if (typeof req.query.search === "string") filters.search = req.query.search;

        const products = await listProducts(filters);
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
};

/** Returns one active product by id. */
export const getProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = getProductId(req, res);
        if (!productId) return;

        const product = await getProductById(productId);
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

/** Updates a product by id. */
export const updateProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = getProductId(req, res);
        if (!productId) return;

        const product = await updateProduct(productId, req.body);
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

/** Soft-deletes a product by id. */
export const deleteProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = getProductId(req, res);
        if (!productId) return;

        await deleteProduct(productId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
