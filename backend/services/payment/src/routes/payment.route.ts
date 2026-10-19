import { Router } from "express";

import {
    createOrder,
    verify,
    getByOrderId,
    getConfig,
} from "../controllers/payment.controller.js";

const router = Router();

/** Public: tells the frontend whether Razorpay checkout is available. */
router.get("/config", getConfig);

router.post("/create-order", createOrder);

router.post("/verify", verify);

router.get(
    "/order/:orderId",
    getByOrderId
);

export default router;
