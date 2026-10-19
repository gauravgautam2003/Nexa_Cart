import { Router } from "express";
import {
    getReportController,
    listReportsController,
    verifyProductController,
} from "../controllers/agent.controller.js";

const router = Router();

// Product service: fire-and-forget verification trigger after create/update.
router.post("/products/:productId/verify", verifyProductController);

// Storefront: the verification badge on product pages.
router.get("/products/:productId/report", getReportController);

// Operations dashboard: recent verification reports.
router.get("/reports", listReportsController);

export default router;
