import express from "express";
import cors from "cors";
import morgan from "morgan";

import { authProxy, productProxy, cartProxy, orderProxy, paymentProxy, inventoryProxy, notificationProxy, agentProxy } from "./proxy/service.proxy.js";
import { resolveIdentity } from "./middleware/identity.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser clients (curl, server-to-server) and known frontends.
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin ?? true);
                return;
            }
            callback(null, false);
        },
        credentials: true,
    }),
);

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API Gateway is running",
    });
});

/*
 * Identity is resolved once here (the auth service validates the access
 * token) and injected downstream as x-user-id / x-user-role headers.
 */
app.use("/api", resolveIdentity);

/*
 * Important:
 * Do NOT use express.json() before these proxy routes.
 *
 * The gateway forwards the request body unchanged to the microservices.
 * Express strips the `/api/<service>` mount path, so each service mounts
 * its router at `/` and receives the remainder of the path.
 */

app.use("/api/auth", authProxy);
app.use("/api/products", productProxy);
app.use("/api/cart", cartProxy);
app.use("/api/orders", orderProxy);
app.use("/api/payments", paymentProxy);
app.use("/api/inventory", inventoryProxy);
app.use("/api/notifications", notificationProxy);
app.use("/api/agent", agentProxy);

app.use(errorMiddleware);

export default app;
