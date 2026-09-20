import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "NexaCart product is running",
        service: "Product",
    });
});

app.use("/", productRoutes);
app.use(errorMiddleware);

export default app;