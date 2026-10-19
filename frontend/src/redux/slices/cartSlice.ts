import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as cartApi from "@/features/cart/cart.api";
import type { Cart, CartItem } from "@/features/cart/cart.types";
import { getErrorMessage } from "@/services/api";

export interface CartState {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    status: "idle" | "loading" | "ready";
    error: string | null;
    /** Bumped after every successful mutation so toasts can react. */
    lastAction: { type: "added" | "updated" | "removed" | "cleared"; productId?: string; tick: number } | null;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    status: "idle",
    error: null,
    lastAction: null,
};

const applyCart = (state: CartState, cart: { items: CartItem[]; totalItems: number; subtotal: number }): void => {
    state.items = cart.items;
    state.totalItems = cart.totalItems;
    state.subtotal = cart.subtotal;
    state.status = "ready";
    state.error = null;
};

export const fetchCartThunk = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
    try {
        return await cartApi.getCart();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const addToCartThunk = createAsyncThunk<
    Cart,
    { productId: string; quantity?: number },
    { rejectValue: string }
>(
    "cart/add",
    async ({ productId, quantity }: { productId: string; quantity?: number }, { rejectWithValue }) => {
        try {
            return await cartApi.addToCart(productId, quantity ?? 1);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Could not add to cart."));
        }
    },
);

export const updateQuantityThunk = createAsyncThunk<
    Cart,
    { productId: string; quantity: number },
    { rejectValue: string }
>(
    "cart/update",
    async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
        try {
            return await cartApi.updateCartItem(productId, quantity);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Could not update quantity."));
        }
    },
);

export const removeItemThunk = createAsyncThunk<Cart, string, { rejectValue: string }>(
    "cart/remove", async (productId: string, { rejectWithValue }) => {
    try {
        return await cartApi.removeCartItem(productId);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Could not remove item."));
    }
});

export const clearCartThunk = createAsyncThunk("cart/clear", async () => {
    await cartApi.clearCart();
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetLocalCart(state) {
            state.items = [];
            state.totalItems = 0;
            state.subtotal = 0;
            state.status = "idle";
            state.error = null;
        },
        dismissCartError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                applyCart(state, action.payload);
            })
            .addCase(fetchCartThunk.rejected, (state) => {
                state.status = "idle";
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                applyCart(state, action.payload);
                state.lastAction = { type: "added", productId: action.meta.arg.productId, tick: Date.now() };
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.error = action.payload ?? "Could not add to cart.";
            })
            .addCase(updateQuantityThunk.fulfilled, (state, action) => {
                applyCart(state, action.payload);
                state.lastAction = { type: "updated", productId: action.meta.arg.productId, tick: Date.now() };
            })
            .addCase(updateQuantityThunk.rejected, (state, action) => {
                state.error = action.payload ?? "Could not update quantity.";
            })
            .addCase(removeItemThunk.fulfilled, (state, action) => {
                applyCart(state, action.payload);
                state.lastAction = { type: "removed", productId: action.meta.arg, tick: Date.now() };
            })
            .addCase(removeItemThunk.rejected, (state, action) => {
                state.error = action.payload ?? "Could not remove item.";
            })
            .addCase(clearCartThunk.fulfilled, (state) => {
                state.items = [];
                state.totalItems = 0;
                state.subtotal = 0;
                state.lastAction = { type: "cleared", tick: Date.now() };
            });
    },
});

export const { resetLocalCart, dismissCartError } = cartSlice.actions;
export default cartSlice.reducer;
