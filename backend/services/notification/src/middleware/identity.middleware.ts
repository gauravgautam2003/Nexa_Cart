import type { NextFunction, Request, Response } from "express";

/**
 * Reads the `x-user-id` / `x-user-role` headers injected by the API gateway
 * and attaches them to the request.
 */
export const resolveIdentity = (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.header("x-user-id");
    const role = req.header("x-user-role") ?? "user";

    if (userId) {
        req.user = { id: userId, role: role === "admin" ? "admin" : "user" };
    }

    next();
};
