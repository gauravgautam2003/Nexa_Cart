"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { restoreThunk } from "@/redux/slices/authSlice";

/** Mounts the redux store and restores the session from cookies once. */
export default function StoreProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        void store.dispatch(restoreThunk());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
