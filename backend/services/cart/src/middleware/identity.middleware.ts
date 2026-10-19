import type { NextFunction, Request, Response } from "express";

/**
 * Reads the `x-user-id` header injected by the API gateway after it
 * validated the caller's access token, and attaches it to the request.
 */
export const resolveIdentity = (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.header("x-user-id");
    const role = req.header("x-user-role") ?? "user";

    if (userId) {
        req.user = { id: userId, role: role === "admin" ? "admin" : "user" };
    }

    next();
};
