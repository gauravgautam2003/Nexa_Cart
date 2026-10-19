import Product from "../models/product.model.js";
import type { IProduct } from "../models/product.model.js";
import { triggerVerification } from "./agent.client.js";
import type {
    CreateProductRequest,
    UpdateProductRequest,
    ProductResponse,
    ProductQuery,
    PaginationMeta,
    ProductSort,
} from "../types/product.types.js";


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

const SORT_OPTIONS: Record<ProductSort, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1, reviewCount: -1 },
    discount: { discountPrice: 1, price: -1 },
};

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;

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

    // The NexaGuard agent re-checks the listing automatically.
    triggerVerification(product._id.toString());

    return toProductResponse(product);
};

/** Returns active products with filtering, sorting and pagination. */
export const listProducts = async (query?: ProductQuery): Promise<{ products: ProductResponse[]; pagination: PaginationMeta }> => {
    const filter: Record<string, unknown> = { isActive: true };

    if (query?.category) {
        filter.category = query.category;
    }

    if (query?.brand) {
        filter.brand = query.brand;
    }

    if (query?.search) {
        filter.$text = { $search: query.search };
    }

    const priceFilters: Record<string, number> = {};
    if (typeof query?.minPrice === "number" && Number.isFinite(query.minPrice)) {
        priceFilters.$gte = query.minPrice;
    }
    if (typeof query?.maxPrice === "number" && Number.isFinite(query.maxPrice)) {
        priceFilters.$lte = query.maxPrice;
    }
    if (Object.keys(priceFilters).length > 0) {
        filter.price = priceFilters;
    }

    const page = Math.max(1, Math.floor(query?.page ?? 1));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(query?.limit ?? DEFAULT_PAGE_SIZE)));
    const sort = SORT_OPTIONS[query?.sort ?? "newest"] ?? SORT_OPTIONS.newest;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    return {
        products: products.map(toProductResponse),
        pagination: {
            page,
            limit,
            total,
            pages: Math.max(1, Math.ceil(total / limit)),
        },
    };
};

/** Returns every distinct category for navigation and filters. */
export const listCategories = async (): Promise<string[]> => {
    const categories = await Product.distinct("category", { isActive: true });
    return categories.sort();
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

    // Product changed -> the agent re-verifies the listing.
    triggerVerification(product._id.toString());

    return toProductResponse(product);
};

/** Soft-deletes a product by marking it inactive. */
export const deleteProduct = async (productId: string): Promise<void> => {
    const product = await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });

    if (!product) {
        throw new Error("Product not found");
    }
};
