import express from "express";

import cartRoutes from "./routes/cart.route.js";
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

app.use("/api/cart", cartRoutes);

// Error middleware must be last
app.use(errorMiddleware);

export default app;