import Product from "../models/product.model.js";
import type { IProduct } from "../models/product.model.js";
import type { CreateProductRequest, UpdateProductRequest, ProductResponse } from "../types/product.types.js";


const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const toProductResponse = (product: IProduct): ProductResponse => ({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    ...(product.discountPrice !== undefined && { discountPrice: product.discountPrice }),
    category: product.category,
    ...(product.brand !== undefined && { brand: product.brand }),
    images: product.images,
    stock: product.stock,
    sku: product.sku,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isActive: product.isActive,
    createdBy: product.createdBy.toString(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
});

/** Creates a product after validating its SKU and generated slug are unique. */
export const createProduct = async (data: CreateProductRequest, createdBy: string): Promise<ProductResponse> => {
    const slug = generateSlug(data.name);
    const existingProduct = await Product.findOne({
        $or: [{
            sku: data.sku
        }, {
            slug
        }]
    });

    if (existingProduct?.sku === data.sku) {
        throw new Error("SKU already exists");
    }

    if (existingProduct?.slug === slug) {
        throw new Error("Product with this name already exists");
    }

    const product = await Product.create({ ...data, slug, createdBy });
    return toProductResponse(product);
};

/** Returns all active products, optionally filtered by category or search text. */
export const listProducts = async (query?: { category?: string; search?: string }): Promise<ProductResponse[]> => {
    const filter: Record<string, unknown> = { isActive: true };

    if (query?.category) {
        filter.category = query.category;
    }

    if (query?.search) {
        filter.$text = { $search: query.search };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return products.map(toProductResponse);
};

/** Finds one product by its MongoDB id. */
export const getProductById = async (productId: string): Promise<ProductResponse> => {
    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
        throw new Error("Product not found");
    }

    return toProductResponse(product);
};

/** Updates product fields and regenerates the slug when the name changes. */
export const updateProduct = async (productId: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    const updateData: Record<string, unknown> = { ...data };

    if (data.name) {
        updateData.slug = generateSlug(data.name);
    }

    const product = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: updateData },
        { new: true, runValidators: true },
    );

    if (!product) {
        throw new Error("Product not found");
    }

    return toProductResponse(product);
};

/** Soft-deletes a product by marking it inactive. */
export const deleteProduct = async (productId: string): Promise<void> => {
    const product = await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });

    if (!product) {
        throw new Error("Product not found");
    }
};