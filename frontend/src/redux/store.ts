import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer, { persistWishlist } from "./slices/wishlistSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
});

// Persist the (client-only) wishlist whenever it changes.
let previousWishlist = store.getState().wishlist.items;
store.subscribe(() => {
    const next = store.getState().wishlist.items;
    if (next !== previousWishlist) {
        previousWishlist = next;
        persistWishlist(next);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
