import type {
    AgentVerdict,
    CheckResult,
    InventorySnapshot,
    ProductSnapshot,
    VerificationOutcome,
} from "../types/agent.types.js";

export const ENGINE_VERSION = "nexaguard-1.0.0";

const KNOWN_CATEGORIES = [
    "electronics",
    "mobiles",
    "laptops",
    "fashion",
    "footwear",
    "home & kitchen",
    "appliances",
    "beauty",
    "books",
    "sports",
    "toys",
    "grocery",
    "jewellery",
    "pets",
];

const SKU_PATTERN = /^[A-Z0-9][A-Z0-9-]{3,19}$/;
const MAX_SANE_PRICE = 500_000;

const checkTitle = (product: ProductSnapshot): CheckResult => {
    const name = product.name?.trim() ?? "";

    if (name.length >= 8) {
        return {
            key: "title",
            label: "Product title",
            status: "pass",
            detail: `Title is descriptive (${name.length} characters).`,
        };
    }

    if (name.length >= 4) {
        return {
            key: "title",
            label: "Product title",
            status: "warn",
            detail: "Title is short; buyers may not find this listing by search.",
        };
    }

    return {
        key: "title",
        label: "Product title",
        status: "fail",
        detail: "Title is missing or too short to be useful.",
    };
};

const checkDescription = (product: ProductSnapshot): CheckResult => {
    const description = product.description?.trim() ?? "";
    const words = description.split(/\s+/).filter(Boolean).length;

    if (description.length >= 120 && words >= 15) {
        return {
            key: "description",
            label: "Description quality",
            status: "pass",
            detail: `Rich description with ${words} words.`,
        };
    }

    if (description.length >= 40) {
        return {
            key: "description",
            label: "Description quality",
            status: "warn",
            detail: "Description is brief; add specs, materials and usage details.",
        };
    }

    return {
        key: "description",
        label: "Description quality",
        status: "fail",
        detail: "Description is missing or too thin for buyers to judge the product.",
    };
};

const checkPricing = (product: ProductSnapshot): CheckResult => {
    if (!Number.isFinite(product.price) || product.price <= 0) {
        return {
            key: "pricing",
            label: "Price sanity",
            status: "fail",
            detail: "Price must be a positive amount.",
        };
    }

    if (product.price > MAX_SANE_PRICE) {
        return {
            key: "pricing",
            label: "Price sanity",
            status: "warn",
            detail: `Price of ₹${product.price.toLocaleString("en-IN")} looks unusually high; confirm it is correct.`,
        };
    }

    return {
        key: "pricing",
        label: "Price sanity",
        status: "pass",
        detail: `Price ₹${product.price.toLocaleString("en-IN")} is within the expected range.`,
    };
};

const checkDiscount = (product: ProductSnapshot): CheckResult => {
    if (product.discountPrice === undefined || product.discountPrice === null) {
        return {
            key: "discount",
            label: "Discount offer",
            status: "pass",
            detail: "Listing is sold at full price; no misleading discount.",
        };
    }

    if (product.discountPrice > 0 && product.discountPrice < product.price) {
        const percent = Math.round((1 - product.discountPrice / product.price) * 100);
        return {
            key: "discount",
            label: "Discount offer",
            status: "pass",
            detail: `Genuine ${percent}% discount applied.`,
        };
    }

    return {
        key: "discount",
        label: "Discount offer",
        status: "fail",
        detail: "Discounted price is not actually lower than the listed price.",
    };
};

const checkImagery = (product: ProductSnapshot): CheckResult => {
    const images = product.images ?? [];

    if (images.length >= 3) {
        return {
            key: "imagery",
            label: "Product imagery",
            status: "pass",
            detail: `${images.length} images available.`,
        };
    }

    if (images.length === 2) {
        return {
            key: "imagery",
            label: "Product imagery",
            status: "warn",
            detail: "Only 2 images; add at least 3 angles for buyer confidence.",
        };
    }

    if (images.length === 1) {
        return {
            key: "imagery",
            label: "Product imagery",
            status: "warn",
            detail: "Single image listing; conversions drop sharply without more photos.",
        };
    }

    return {
        key: "imagery",
        label: "Product imagery",
        status: "fail",
        detail: "No images on the listing.",
    };
};

const checkCategory = (product: ProductSnapshot): CheckResult => {
    const category = product.category?.trim().toLowerCase() ?? "";

    if (!category) {
        return {
            key: "category",
            label: "Category",
            status: "fail",
            detail: "Listing has no category.",
        };
    }

    if (KNOWN_CATEGORIES.includes(category)) {
        return {
            key: "category",
            label: "Category",
            status: "pass",
            detail: `Recognised category "${product.category}".`,
        };
    }

    return {
        key: "category",
        label: "Category",
        status: "warn",
        detail: `Custom category "${product.category}" is not in the standard taxonomy.`,
    };
};

const checkSku = (product: ProductSnapshot): CheckResult => {
    const sku = product.sku?.trim().toUpperCase() ?? "";

    if (SKU_PATTERN.test(sku)) {
        return {
            key: "sku",
            label: "SKU format",
            status: "pass",
            detail: `SKU ${sku} follows the inventory convention.`,
        };
    }

    return {
        key: "sku",
        label: "SKU format",
        status: "warn",
        detail: `SKU "${product.sku}" is unusual; prefer 4-20 uppercase letters, digits or dashes.`,
    };
};

const checkStock = (product: ProductSnapshot): CheckResult => {
    if (product.stock > 0) {
        return {
            key: "stock",
            label: "Catalogue stock",
            status: "pass",
            detail: `${product.stock} units advertised in the catalogue.`,
        };
    }

    if (product.stock === 0) {
        return {
            key: "stock",
            label: "Catalogue stock",
            status: "warn",
            detail: "Listing is out of stock and will show as unavailable.",
        };
    }

    return {
        key: "stock",
        label: "Catalogue stock",
        status: "fail",
        detail: "Stock count is negative, which is invalid.",
    };
};

const checkBrand = (product: ProductSnapshot): CheckResult => {
    const brand = product.brand?.trim() ?? "";

    if (brand) {
        return {
            key: "brand",
            label: "Brand attribution",
            status: "pass",
            detail: `Brand "${product.brand}" is listed.`,
        };
    }

    return {
        key: "brand",
        label: "Brand attribution",
        status: "warn",
        detail: "No brand set; branded searches will not surface this listing.",
    };
};

const checkInventorySync = (
    product: ProductSnapshot,
    inventory: InventorySnapshot | null,
): CheckResult => {
    if (!inventory) {
        return {
            key: "inventory-sync",
            label: "Inventory sync",
            status: "skipped",
            detail: "No inventory record found for this product yet.",
        };
    }

    const available = inventory.availableStock ?? 0;
    const lowThreshold = inventory.lowStockThreshold ?? 5;

    if (available <= 0) {
        return {
            key: "inventory-sync",
            label: "Inventory sync",
            status: "warn",
            detail: "Warehouse reports zero available stock for this product.",
        };
    }

    if (available <= lowThreshold) {
        return {
            key: "inventory-sync",
            label: "Inventory sync",
            status: "warn",
            detail: `Warehouse stock is low (${available} left, threshold ${lowThreshold}).`,
        };
    }

    const drift = Math.abs(product.stock - available);

    if (drift > 5) {
        return {
            key: "inventory-sync",
            label: "Inventory sync",
            status: "warn",
            detail: `Catalogue says ${product.stock} but warehouse reports ${available}; sync the numbers.`,
        };
    }

    return {
        key: "inventory-sync",
        label: "Inventory sync",
        status: "pass",
        detail: `Warehouse stock (${available}) matches the catalogue.`,
    };
};

const buildTags = (product: ProductSnapshot): string[] => {
    const tags: string[] = [];

    if (product.category) tags.push(product.category.toLowerCase());
    if (product.brand) tags.push(product.brand.toLowerCase());

    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

    if (price <= 500) tags.push("budget");
    else if (price <= 20_000) tags.push("mid-range");
    else tags.push("premium");

    if (product.rating >= 4.5 && product.reviewCount >= 5) tags.push("top-rated");
    if (product.stock > 0 && product.stock <= 5) tags.push("low-stock");
    if (product.discountPrice && product.discountPrice < product.price) tags.push("on-sale");

    return tags;
};

const scoreOf = (checks: CheckResult[]): number => {
    const counted = checks.filter((check) => check.status !== "skipped");

    if (counted.length === 0) return 0;

    const earned = counted.reduce((total, check) => {
        if (check.status === "pass") return total + 1;
        if (check.status === "warn") return total + 0.5;
        return total;
    }, 0);

    return Math.round((earned / counted.length) * 100);
};

const verdictOf = (score: number): AgentVerdict => {
    if (score >= 85) return "verified";
    if (score >= 60) return "needs_review";
    return "rejected";
};

/**
 * NexaGuard's deterministic verification pass. It reads the live product
 * listing plus the warehouse inventory record and grades the listing on
 * ten listing-quality checks.
 */
export const evaluateProduct = (
    product: ProductSnapshot,
    inventory: InventorySnapshot | null,
): VerificationOutcome => {
    const checks: CheckResult[] = [
        checkTitle(product),
        checkDescription(product),
        checkPricing(product),
        checkDiscount(product),
        checkImagery(product),
        checkCategory(product),
        checkSku(product),
        checkStock(product),
        checkBrand(product),
        checkInventorySync(product, inventory),
    ];

    const issues = checks
        .filter((check) => check.status === "fail")
        .map((check) => `${check.label}: ${check.detail}`);

    const suggestions = checks
        .filter((check) => check.status === "warn" || check.status === "skipped")
        .map((check) => `${check.label}: ${check.detail}`);

    const score = scoreOf(checks);
    const verdict = verdictOf(score);
    const passed = checks.filter((check) => check.status === "pass").length;
    const counted = checks.filter((check) => check.status !== "skipped").length;

    const verdictLine =
        verdict === "verified"
            ? "It is cleared for the storefront."
            : verdict === "needs_review"
                ? "A human should review it before it ranks in search."
                : "It should not go live in its current shape.";

    const summary = `"${product.name}" scored ${score}/100 in NexaGuard's ${counted}-check verification pass (${passed} passed). ${verdictLine}`;

    return {
        score,
        verdict,
        checks,
        issues,
        suggestions,
        summary,
        tags: buildTags(product),
        engineVersion: ENGINE_VERSION,
    };
};
