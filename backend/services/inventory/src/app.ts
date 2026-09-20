import express from "express";
import dotenv from "dotenv";
import router from "./routes/inventory.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "NexaCart inventory is running",
        service: "Inventory",
    });
});


app.use("/", router); // Error middleware must be registered last
app.use(errorMiddleware);

export default app;