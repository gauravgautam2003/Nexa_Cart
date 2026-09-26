export const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
    product: process.env.PRODUCT_SERVICE_URL || "http://localhost:5003",
    cart: process.env.CART_SERVICE_URL || "http://localhost:5004",
    order: process.env.ORDER_SERVICE_URL || "http://localhost:5005",
    payment: process.env.PAYMENT_SERVICE_URL || "http://localhost:5006",
    inventory: process.env.INVENTORY_SERVICE_URL || "http://localhost:5007",
    notification: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5008",
} as const;