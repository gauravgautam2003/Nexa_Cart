export interface ProductSnapshot {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
}

export interface InventorySnapshot {
    availableStock?: number;
    reservedStock?: number;
    soldStock?: number;
    lowStockThreshold?: number;
}

export type CheckStatus = "pass" | "warn" | "fail" | "skipped";

export interface CheckResult {
    key: string;
    label: string;
    status: CheckStatus;
    detail: string;
}

export type AgentVerdict = "verified" | "needs_review" | "rejected";

export interface VerificationOutcome {
    score: number;
    verdict: AgentVerdict;
    checks: CheckResult[];
    issues: string[];
    suggestions: string[];
    summary: string;
    tags: string[];
    engineVersion: string;
}

export interface AgentReportResponse extends VerificationOutcome {
    id: string;
    productId: string;
    verifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReportListMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
