import { api } from "@/services/api";
import type { AgentReport } from "./agent.types";

/**
 * The storefront reads NexaGuard's stored report. A 404 simply means the
 * agent has not verified the listing yet, which pages render as "pending".
 */
export const getAgentReport = async (productId: string): Promise<AgentReport | null> => {
    try {
        const { data } = await api.get<{ success: boolean; report: AgentReport }>(
            `/agent/products/${productId}/report`,
        );
        return data.report ?? null;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            const status = (error as { response?: { status?: number } }).response?.status;
            if (status === 404) return null;
        }
        throw error;
    }
};

/** Admin: force a re-verification pass. */
export const verifyProduct = async (productId: string): Promise<AgentReport> => {
    const { data } = await api.post<{ success: boolean; report: AgentReport }>(
        `/agent/products/${productId}/verify`,
    );
    return data.report;
};

/** Admin: recent reports across the catalogue. */
export const listAgentReports = async (limit = 20): Promise<AgentReport[]> => {
    const { data } = await api.get<{
        success: boolean;
        reports: AgentReport[];
        pagination: { page: number; pages: number; total: number; limit: number };
    }>("/agent/reports", { params: { limit } });
    return data.reports ?? [];
};
