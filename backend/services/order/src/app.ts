import express from "express";
import cors from "cors";

import orderRoutes from "./routes/order.route.js";
import { resolveIdentity } from "./middleware/identity.middleware.js";
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

/*
 * The gateway strips `/api/orders`, so this service mounts at `/`.
 * Identity arrives as `x-user-id` set by the gateway or by an internal
 * service-to-service call.
 */
app.use("/", resolveIdentity, orderRoutes);

app.use(errorMiddleware);

export default app;
