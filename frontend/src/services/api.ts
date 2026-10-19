import axios from "axios";
import { API_URL } from "@/lib/constants";

/**
 * Single axios client for the API gateway. Auth rides on httpOnly cookies,
 * so every request carries credentials and a 401 triggers one silent
 * refresh-token rotation before the original request is replayed.
 * The gateway mounts every service under `/api/<service>`.
 */
export const api = axios.create({
    baseURL: `${API_URL.replace(/\/+$/, "")}/api`,
    withCredentials: true,
    timeout: 20000,
});

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        const original = error as {
            config?: { _retry?: boolean; url?: string };
            response?: { status?: number };
        };

        const status = original.response?.status;
        const url = original.config?.url ?? "";

        const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh");

        if (status === 401 && original.config && !original.config._retry && !isAuthCall) {
            original.config._retry = true;

            try {
                refreshPromise ??= api.post("/auth/refresh").finally(() => {
                    refreshPromise = null;
                });
                await refreshPromise;
                return api(original.config as never);
            } catch {
                refreshPromise = null;
            }
        }

        return Promise.reject(error);
    },
);

/** Drops empty values so they never become query parameters. */
export const compactParams = (params: Record<string, unknown>): Record<string, string> => {
    const output: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        output[key] = String(value);
    }

    return output;
};

/** Pulls the backend's error message out of any thrown value. */
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again."): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) return data.message;
        if (!error.response) return "Cannot reach the server. Is the backend running?";
        return fallback;
    }

    if (error instanceof Error && error.message) return error.message;

    return fallback;
};
