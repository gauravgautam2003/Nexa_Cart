import { Router } from "express";

import {
    createOrder,
    verify,
    getByOrderId,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", createOrder);

router.post("/verify", verify);

router.get(
    "/order/:orderId",
    getByOrderId
);

export default router;