export type AgentVerdict = "verified" | "needs_review" | "rejected";

export type CheckStatus = "pass" | "warn" | "fail" | "skipped";

export interface AgentCheck {
    key: string;
    label: string;
    status: CheckStatus;
    detail: string;
}

export interface AgentReport {
    id: string;
    productId: string;
    score: number;
    verdict: AgentVerdict;
    checks: AgentCheck[];
    issues: string[];
    suggestions: string[];
    summary: string;
    tags: string[];
    engineVersion: string;
    verifiedAt: string;
    createdAt: string;
    updatedAt: string;
}
