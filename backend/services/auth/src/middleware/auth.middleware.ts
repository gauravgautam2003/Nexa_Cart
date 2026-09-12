import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-super-secret-key";

/** Validates the access-token cookie and attaches its user id to the request. */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.accessToken as string | undefined;

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

        req.user = {
            id: payload.id,
            role: "user"
        };

        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
};