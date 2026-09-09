import express from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NexaCart auth is running",
    service: "Auth",
  });
});

export default app;