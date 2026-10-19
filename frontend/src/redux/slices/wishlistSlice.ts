import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/features/products/products.types";

export type WishlistItem = Pick<
    Product,
    "id" | "name" | "price" | "images" | "rating" | "reviewCount" | "category" | "stock" | "slug"
> & { discountPrice?: number };

interface WishlistState {
    items: WishlistItem[];
}

const STORAGE_KEY = "nexacart.wishlist";

const loadWishlist = (): WishlistState => {
    if (typeof window === "undefined") return { items: [] };

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        return { items: Array.isArray(parsed) ? (parsed as WishlistItem[]) : [] };
    } catch {
        return { items: [] };
    }
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: loadWishlist(),
    reducers: {
        toggleWishlist(state, action: PayloadAction<WishlistItem>) {
            const index = state.items.findIndex((item) => item.id === action.payload.id);

            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.unshift(action.payload);
            }
        },
        removeWishlistItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const { toggleWishlist, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

/** Persist helper invoked by the store provider on every change. */
export const persistWishlist = (items: WishlistItem[]): void => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Storage may be unavailable (private mode); wishlist stays in-memory.
    }
};
