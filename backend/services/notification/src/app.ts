import express from "express";

import notificationRoutes from "./routes/notification.route.js";
import { resolveIdentity } from "./middleware/identity.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Notification Service is running",
    });
});

/*
 * The gateway strips `/api/notifications`, so this service mounts at `/`.
 * The `POST /` endpoint stays open for internal service-to-service calls
 * (e.g. the order service); user-scoped routes require the gateway identity.
 */
app.use("/", resolveIdentity, notificationRoutes);
app.use(errorMiddleware);

export default app;
