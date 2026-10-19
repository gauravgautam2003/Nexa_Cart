import axios from "axios";

const agentClient = axios.create({
    baseURL: process.env.AGENT_SERVICE_URL ?? "http://localhost:5009",
    timeout: 15000,
});

/**
 * Asks the NexaGuard agent to verify a product after it is created or
 * updated. Fire-and-forget: catalog writes never wait on the agent, and an
 * agent outage never breaks product management.
 */
export const triggerVerification = (productId: string): void => {
    agentClient
        .post(`/products/${productId}/verify`)
        .then(() => {
            console.log(`Agent verified product ${productId}`);
        })
        .catch((error: unknown) => {
            console.error(`Agent verification failed for product ${productId}:`, {
                error: error instanceof Error ? error.message : error,
            });
        });
};
