import type { NextFunction, Request, Response } from "express";

/**
 * Ensures the caller only accesses notifications of the identity resolved
 * by the gateway (`x-user-id`), never someone else's.
 */
export const requireSelfParam = (req: Request, res: Response, next: NextFunction): void => {
    const { userId } = req.params;

    if (!req.user?.id) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
    }

    if (userId && userId !== req.user.id && req.user.role !== "admin") {
        res.status(403).json({ success: false, message: "You may only access your own notifications" });
        return;
    }

    next();
};
