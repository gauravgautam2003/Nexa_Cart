import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/service.js";

/*
 * Express strips the mount path (`/api/products`) before the proxy runs, so
 * the upstream service receives the remainder (e.g. `/abc123`), matching
 * services that mount their routers at `/`.
 */

export const authProxy = createProxyMiddleware({
    target: SERVICES.auth,
    changeOrigin: true,
});

export const productProxy = createProxyMiddleware({
    target: SERVICES.product,
    changeOrigin: true,
});

export const cartProxy = createProxyMiddleware({
    target: SERVICES.cart,
    changeOrigin: true,
});

export const orderProxy = createProxyMiddleware({
    target: SERVICES.order,
    changeOrigin: true,
});

export const paymentProxy = createProxyMiddleware({
    target: SERVICES.payment,
    changeOrigin: true,
});

export const inventoryProxy = createProxyMiddleware({
    target: SERVICES.inventory,
    changeOrigin: true,
});

export const notificationProxy = createProxyMiddleware({
    target: SERVICES.notification,
    changeOrigin: true,
});

export const agentProxy = createProxyMiddleware({
    target: SERVICES.agent,
    changeOrigin: true,
});
