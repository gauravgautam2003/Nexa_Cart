import { api } from "@/services/api";
import type { AuthResponse, LoginInput, RegisterInput, User } from "./auth.types";

export const login = async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", input);
    return data;
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", input);
    return data;
};

/** Rotates the refresh cookie and returns the current user, or null when signed out. */
export const restoreSession = async (): Promise<User | null> => {
    try {
        const { data } = await api.post<AuthResponse>("/auth/refresh");
        return data.user ?? null;
    } catch {
        return null;
    }
};

export const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
};

/** Cheap "am I signed in?" probe used by the gateway-facing client. */
export const verifySession = async (): Promise<{ id: string; role: string } | null> => {
    try {
        const { data } = await api.get<{ user?: { id: string; role: string } }>("/auth/verify");
        return data.user ?? null;
    } catch {
        return null;
    }
};
