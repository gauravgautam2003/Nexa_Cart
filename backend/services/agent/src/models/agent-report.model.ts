import mongoose, { Document, Schema } from "mongoose";
import type { AgentVerdict, CheckResult } from "../types/agent.types.js";

export interface IAgentReport extends Document {
    productId: mongoose.Types.ObjectId;
    score: number;
    verdict: AgentVerdict;
    checks: CheckResult[];
    issues: string[];
    suggestions: string[];
    summary: string;
    tags: string[];
    engineVersion: string;
    verifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const checkResultSchema = new Schema<CheckResult>(
    {
        key: {
            type: String,
            required: true,
            trim: true,
        },

        label: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pass", "warn", "fail", "skipped"],
            required: true,
        },

        detail: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
);

const agentReportSchema = new Schema<IAgentReport>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
        },

        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        verdict: {
            type: String,
            enum: ["verified", "needs_review", "rejected"],
            required: true,
            index: true,
        },

        checks: {
            type: [checkResultSchema],
            default: [],
        },

        issues: {
            type: [String],
            default: [],
        },

        suggestions: {
            type: [String],
            default: [],
        },

        summary: {
            type: String,
            required: true,
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        engineVersion: {
            type: String,
            required: true,
        },

        verifiedAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const AgentReport = mongoose.model<IAgentReport>("AgentReport", agentReportSchema);

export default AgentReport;
