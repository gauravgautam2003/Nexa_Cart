import express from "express";

import notificationRoutes from "./routes/notification.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Notification Service is running",
    });
});

app.use("/", notificationRoutes);
app.use(errorMiddleware);

export default app;