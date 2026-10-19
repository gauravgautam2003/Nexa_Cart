import type { NextFunction, Request, Response } from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    listCategories,
    listProducts,
    updateProduct,
} from "../services/product.service.js";
import type { ProductQuery, ProductSort } from "../types/product.types.js";

const getProductId = (req: Request, res: Response): string | undefined => {
    const { id } = req.params;

    if (typeof id !== "string") {
        res.status(400).json({ success: false, message: "Product id is required" });
        return undefined;
    }

    return id;
};

const SORT_VALUES: ProductSort[] = ["newest", "oldest", "price-asc", "price-desc", "rating", "discount"];

const parseListQuery = (req: Request): ProductQuery => {
    const query: ProductQuery = {};

    if (typeof req.query.category === "string" && req.query.category) query.category = req.query.category;
    if (typeof req.query.brand === "string" && req.query.brand) query.brand = req.query.brand;
    if (typeof req.query.search === "string" && req.query.search) query.search = req.query.search;

    if (typeof req.query.minPrice === "string") {
        const minPrice = Number(req.query.minPrice);
        if (Number.isFinite(minPrice)) query.minPrice = minPrice;
    }

    if (typeof req.query.maxPrice === "string") {
        const maxPrice = Number(req.query.maxPrice);
        if (Number.isFinite(maxPrice)) query.maxPrice = maxPrice;
    }

    if (typeof req.query.sort === "string" && SORT_VALUES.includes(req.query.sort as ProductSort)) {
        query.sort = req.query.sort as ProductSort;
    }

    if (typeof req.query.page === "string") {
        const page = Number(req.query.page);
        if (Number.isFinite(page)) query.page = page;
    }

    if (typeof req.query.limit === "string") {
        const limit = Number(req.query.limit);
        if (Number.isFinite(limit)) query.limit = limit;
    }

    return query;
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

/** Returns active products with optional filters, sorting and pagination. */
export const listProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { products, pagination } = await listProducts(parseListQuery(req));
        res.status(200).json({ success: true, products, pagination });
    } catch (error) {
        next(error);
    }
};

/** Returns every distinct product category. */
export const listCategoriesController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await listCategories();
        res.status(200).json({ success: true, categories });
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
