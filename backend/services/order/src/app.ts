import express from "express";
import cors from "cors";

import orderRoutes from "./routes/order.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        service: "order-service",
        message: "Order Service is running",
    });
});

app.use("/", orderRoutes);

app.use(errorMiddleware);

export default app;