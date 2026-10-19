import mongoose from "mongoose";
import AgentReport from "../models/agent-report.model.js";
import type { IAgentReport } from "../models/agent-report.model.js";
import { evaluateProduct } from "./verification.engine.js";
import { fetchInventory, fetchProduct } from "./clients.js";
import type { AgentReportResponse, ReportListMeta } from "../types/agent.types.js";

const toResponse = (report: IAgentReport): AgentReportResponse => ({
    id: report._id.toString(),
    productId: report.productId.toString(),
    score: report.score,
    verdict: report.verdict,
    checks: report.checks,
    issues: report.issues,
    suggestions: report.suggestions,
    summary: report.summary,
    tags: report.tags,
    engineVersion: report.engineVersion,
    verifiedAt: report.verifiedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
});

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

/** Runs the full verification pass and stores the latest report. */
export const verifyProduct = async (productId: string): Promise<AgentReportResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    const product = await fetchProduct(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    const inventory = await fetchInventory(productId);
    const outcome = evaluateProduct(product, inventory);

    const report = await AgentReport.findOneAndUpdate(
        { productId },
        {
            $set: {
                ...outcome,
                productId,
                verifiedAt: new Date(),
            },
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        },
    );

    return toResponse(report);
};

/** Returns the most recent stored report for a product. */
export const getReport = async (productId: string): Promise<AgentReportResponse> => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid product ID");
    }

    const report = await AgentReport.findOne({ productId });

    if (!report) {
        throw new Error("Verification report not found");
    }

    return toResponse(report);
};

/** Returns recent reports, newest first, for the operations dashboard. */
export const listReports = async (
    page?: number,
    limit?: number,
): Promise<{ reports: AgentReportResponse[]; pagination: ReportListMeta }> => {
    const safePage = Math.max(1, Math.floor(page ?? 1));
    const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(limit ?? DEFAULT_PAGE_SIZE)));

    const [reports, total] = await Promise.all([
        AgentReport.find()
            .sort({ verifiedAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit),
        AgentReport.countDocuments(),
    ]);

    return {
        reports: reports.map(toResponse),
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            pages: Math.max(1, Math.ceil(total / safeLimit)),
        },
    };
};
