import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "@/features/auth/auth.api";
import type { LoginInput, RegisterInput, User } from "@/features/auth/auth.types";
import { getErrorMessage } from "@/services/api";

export interface AuthState {
    user: User | null;
    status: "idle" | "loading" | "authenticated" | "error";
    error: string | null;
    /** True once the initial cookie-based session restore has settled. */
    hydrated: boolean;
}

const initialState: AuthState = {
    user: null,
    status: "idle",
    error: null,
    hydrated: false,
};

export const loginThunk = createAsyncThunk<User, LoginInput, { rejectValue: string }>(
    "auth/login",
    async (input: LoginInput, { rejectWithValue }) => {
    try {
        const response = await authApi.login(input);
        return response.user;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Invalid email or password."));
    }
});

export const registerThunk = createAsyncThunk<User, RegisterInput, { rejectValue: string }>(
    "auth/register",
    async (input: RegisterInput, { rejectWithValue }) => {
    try {
        const response = await authApi.register(input);
        return response.user;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Could not create your account."));
    }
});

/** Silent restore from the httpOnly refresh cookie on app start. */
export const restoreThunk = createAsyncThunk("auth/restore", async () => authApi.restoreSession());

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    try {
        await authApi.logout();
    } catch {
        // Local session is cleared regardless of server state.
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = "authenticated";
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload ?? "Login failed.";
            })
            .addCase(registerThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.status = "authenticated";
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload ?? "Registration failed.";
            })
            .addCase(restoreThunk.fulfilled, (state, action) => {
                state.hydrated = true;
                state.user = action.payload;
                state.status = action.payload ? "authenticated" : "idle";
            })
            .addCase(restoreThunk.rejected, (state) => {
                state.hydrated = true;
                state.user = null;
                state.status = "idle";
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.status = "idle";
                state.error = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
