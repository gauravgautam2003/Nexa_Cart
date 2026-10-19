import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-super-secret-key";

/** Extracts the access token from the `accessToken` cookie or an Authorization header. */
const extractToken = (req: Request): string | undefined => {
    const cookieToken = req.cookies?.accessToken as string | undefined;
    if (cookieToken) return cookieToken;

    const authorization = req.headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
        return authorization.slice("Bearer ".length).trim() || undefined;
    }

    return undefined;
};

/** Validates the access token and attaches its user id to the request. */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = extractToken(req);

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Authentication required"
        });
        return;
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);

        if (typeof payload !== "object" || payload === null || typeof payload.id !== "string") {
            res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
            return;
        }

        // The role travels in the JWT so the gateway can forward it downstream.
        const role = payload.role === "admin" ? "admin" : "user";

        req.user = {
            id: payload.id,
            role,
        };

        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
};
