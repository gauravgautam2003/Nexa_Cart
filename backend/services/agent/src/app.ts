import express from "express";
import dotenv from "dotenv";
import agentRoutes from "./routes/agent.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "NexaCart agent is running",
        service: "Agent",
    });
});

app.use("/", agentRoutes);
app.use(errorMiddleware);

export default app;
