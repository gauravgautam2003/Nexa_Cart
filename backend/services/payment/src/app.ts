import express from "express";
import cors from "cors";

import paymentRoutes from "./routes/payment.route.js";
import { errorMiddleware } from "./middleware/error.middlerware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        service: "payment-service",
        message: "Payment Service is running",
    });
});

app.use("/", paymentRoutes);
app.use(errorMiddleware);

export default app;