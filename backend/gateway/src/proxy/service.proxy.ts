import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/service.js";

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