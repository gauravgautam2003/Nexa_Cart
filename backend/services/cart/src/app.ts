import express from "express";

import cartRoutes from "./routes/cart.route.js";
import { resolveIdentity } from "./middleware/identity.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        service: "cart-service",
        message: "Cart Service is running",
    });
});

/*
 * The gateway strips `/api/cart`, so this service mounts at `/` and the
 * router receives `/items`, `/items/:productId`, `/clear`, ...
 * Identity arrives as `x-user-id` set by the gateway.
 */
app.use("/", resolveIdentity, cartRoutes);

// Error middleware must be last
app.use(errorMiddleware);

export default app;
