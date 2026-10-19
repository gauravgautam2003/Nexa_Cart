import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import { SERVICES } from "../config/service.js";

interface ResolvedUser {
    id: string;
    role: string;
}

interface CacheEntry {
    user: ResolvedUser | null;
    expiresAt: number;
}

const CACHE_TTL_MS = 60_000;
const NEGATIVE_CACHE_TTL_MS = 5_000;
const VERIFY_TIMEOUT_MS = 2500;

const cache = new Map<string, CacheEntry>();

/** Extracts a raw access token from the `accessToken` cookie or an Authorization header. */
const extractToken = (req: Request): string | undefined => {
    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        for (const part of cookieHeader.split(";")) {
            const [name, ...rest] = part.trim().split("=");
            if (name === "accessToken") {
                const value = rest.join("=");
                if (value) return value;
            }
        }
    }

    const authorization = req.headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
        return authorization.slice("Bearer ".length).trim() || undefined;
    }

    return undefined;
};

const cacheKey = (token: string): string =>
    crypto.createHash("sha256").update(token).digest("hex");

/** Asks the auth service to validate the token and return the user identity. */
const resolveUser = async (token: string): Promise<ResolvedUser | null> => {
    const key = cacheKey(token);
    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
    }

    try {
        const response = await fetch(`${SERVICES.auth}/verify`, {
            method: "GET",
            headers: {
                Cookie: `accessToken=${token}`,
                Accept: "application/json",
            },
            signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
        });

        if (response.ok) {
            const data = (await response.json()) as { user?: { id?: string; role?: string } };
            const user = data.user?.id
                ? { id: data.user.id, role: data.user.role ?? "user" }
                : null;
            cache.set(key, { user, expiresAt: Date.now() + CACHE_TTL_MS });
            return user;
        }

        cache.set(key, { user: null, expiresAt: Date.now() + NEGATIVE_CACHE_TTL_MS });
        return null;
    } catch {
        cache.set(key, { user: null, expiresAt: Date.now() + NEGATIVE_CACHE_TTL_MS });
        return null;
    }
};

/**
 * Resolves the caller identity once at the edge and forwards it to every
 * downstream service as `x-user-id` / `x-user-role` headers. Downstream
 * services never talk to the auth service directly for identity.
 */
export const resolveIdentity = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = extractToken(req);

        if (!token) {
            next();
            return;
        }

        const user = await resolveUser(token);

        if (user) {
            req.headers["x-user-id"] = user.id;
            req.headers["x-user-role"] = user.role;
        }

        next();
    } catch (error) {
        next(error);
    }
};
