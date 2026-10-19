import type { NextFunction, Request, Response } from "express";
import { getReport, listReports, verifyProduct } from "../services/agent.service.js";

const getProductId = (req: Request, res: Response): string | undefined => {
    const { productId } = req.params;

    if (!productId || Array.isArray(productId)) {
        res.status(400).json({ success: false, message: "Invalid product ID" });
        return undefined;
    }

    return productId;
};

const parseNumber = (value: unknown): number | undefined => {
    if (typeof value !== "string") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

/** Runs (or re-runs) the NexaGuard verification pass for one product. */
export const verifyProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = getProductId(req, res);
        if (!productId) return;

        const report = await verifyProduct(productId);

        res.status(200).json({
            success: true,
            message: "Product verified",
            report,
        });
    } catch (error) {
        next(error);
    }
};

/** Returns the stored verification report for one product. */
export const getReportController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = getProductId(req, res);
        if (!productId) return;

        const report = await getReport(productId);

        res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        next(error);
    }
};

/** Returns recent verification reports across the catalogue. */
export const listReportsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { reports, pagination } = await listReports(
            parseNumber(req.query.page),
            parseNumber(req.query.limit),
        );

        res.status(200).json({
            success: true,
            reports,
            pagination,
        });
    } catch (error) {
        next(error);
    }
};
