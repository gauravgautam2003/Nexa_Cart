import express from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NexaCart auth is running",
    service: "Auth",
  });
});

export default app;