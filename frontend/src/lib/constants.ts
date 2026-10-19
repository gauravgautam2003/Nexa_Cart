export const API_URL: string =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const SHOP_NAME = "NexaCart";
export const SHOP_TAGLINE = "Everything you love, delivered fast.";

/** Free shipping is applied automatically above this order value. */
export const FREE_SHIPPING_THRESHOLD = 4999;
export const SHIPPING_FEE = 40;

export const FALLBACK_CATEGORIES: string[] = [
    "Electronics",
    "Mobiles",
    "Laptops",
    "Fashion",
    "Footwear",
    "Home & Kitchen",
    "Appliances",
    "Beauty",
    "Books",
    "Sports",
    "Toys",
    "Grocery",
];

export const SORT_OPTIONS = [
    { value: "newest", label: "Newest arrivals" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Customer rating" },
    { value: "discount", label: "Biggest discount" },
] as const;
