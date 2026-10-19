import { Router } from "express";
import {
    create,
    getByProductId,
    getBySku,
    update,
    add,
    remove,
} from "../controllers/inventory.controller.js";
import {
    reserve,
    release,
    confirm,
} from "../controllers/inventory.reservation.controller.js";

const router = Router();

// Create inventory
router.post("/", create);

/*
 * Order lifecycle endpoints: the order service reserves stock when an order
 * is placed, releases it on cancellation, and confirms it after payment.
 */
router.post("/product/:productId/reserve", reserve);
router.post("/product/:productId/release", release);
router.post("/product/:productId/confirm", confirm);

// Get inventory by product ID
router.get("/product/:productId", getByProductId);

// Get inventory by SKU
router.get("/sku/:sku", getBySku);

// Update inventory
router.patch("/product/:productId", update);

// Add stock
router.post("/product/:productId/add", add);

// Remove stock
router.post("/product/:productId/remove", remove);

export default router;
