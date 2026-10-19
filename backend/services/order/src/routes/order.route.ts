import { Router } from "express";

import {
    create,
    getAll,
    getById,
    updateStatus,
    cancel,
    updatePaymentStatusController,
    confirmInventoryController,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", create);

router.get("/", getAll);

/*
 * Payment lifecycle endpoints: the payment service calls these after a
 * Razorpay payment is verified (paid -> confirm inventory).
 */
router.patch("/:id/payment-status", updatePaymentStatusController);

router.post("/:id/confirm-inventory", confirmInventoryController);

router.get("/:id", getById);

router.patch("/:id/status", updateStatus);

router.patch("/:id/cancel", cancel);

export default router;
