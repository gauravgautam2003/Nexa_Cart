const pick = (short: string | undefined, long: string | undefined, fallback: string): string =>
    short || long || fallback;

export const SERVICES = {
    auth: pick(process.env.AUTH_SERVICE, process.env.AUTH_SERVICE_URL, "http://localhost:5001"),
    product: pick(process.env.PRODUCT_SERVICE, process.env.PRODUCT_SERVICE_URL, "http://localhost:5003"),
    cart: pick(process.env.CART_SERVICE, process.env.CART_SERVICE_URL, "http://localhost:5004"),
    order: pick(process.env.ORDER_SERVICE, process.env.ORDER_SERVICE_URL, "http://localhost:5005"),
    payment: pick(process.env.PAYMENT_SERVICE, process.env.PAYMENT_SERVICE_URL, "http://localhost:5006"),
    inventory: pick(process.env.INVENTORY_SERVICE, process.env.INVENTORY_SERVICE_URL, "http://localhost:5007"),
    notification: pick(process.env.NOTIFICATION_SERVICE, process.env.NOTIFICATION_SERVICE_URL, "http://localhost:5008"),
    agent: pick(process.env.AGENT_SERVICE, process.env.AGENT_SERVICE_URL, "http://localhost:5009"),
} as const;