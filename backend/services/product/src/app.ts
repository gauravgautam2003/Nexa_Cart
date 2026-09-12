import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NexaCart product is running",
    service: "Product",
  });
});

export default app;