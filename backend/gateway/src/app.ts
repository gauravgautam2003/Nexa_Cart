import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const serviceProxies = [
    ["/api/auth", "AUTH_SERVICE"],
    ["/api/users", "USER_SERVICE"],
    ["/api/products", "PRODUCT_SERVICE"],
    ["/api/cart", "CART_SERVICE"],
    ["/api/orders", "ORDER_SERVICE"],
    ["/api/payments", "PAYMENT_SERVICE"],
    ["/api/inventory", "INVENTORY_SERVICE"],
    ["/api/notifications", "NOTIFICATION_SERVICE"],
] as const;

for (const [route, environmentKey] of serviceProxies) {
    const target = process.env[environmentKey];

    if (!target) {
        throw new Error(`${environmentKey} is not configured`);
    }

    app.use(
        route,
        createProxyMiddleware({
            target,
            changeOrigin: true,
        })
    );
}

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "NexaCart API Gateway is running",
        service: "Gateway",
    });
});

export default app;