import express from "express";
import cors from "cors";
import morgan from "morgan";

import { authProxy, productProxy, cartProxy, orderProxy, paymentProxy, inventoryProxy, notificationProxy } from "./proxy/service.proxy.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:4000",
        credentials: true,
    })
);

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API Gateway is running",
    });
});

/*
 * Important:
 * Do NOT use express.json() before these proxy routes.
 *
 * The gateway should forward the request body
 * to the microservices.
 */

app.use("/api/auth", authProxy);
app.use("/api/products", productProxy);
app.use("/api/cart", cartProxy);
app.use("/api/orders", orderProxy);
app.use("/api/payments", paymentProxy);
app.use("/api/inventory", inventoryProxy);
app.use("/api/notifications", notificationProxy);

app.use(errorMiddleware);

export default app;