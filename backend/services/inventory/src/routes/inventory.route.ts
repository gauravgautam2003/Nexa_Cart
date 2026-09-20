import { Router } from "express";
import { create, getByProductId, getBySku, update, add, remove
} from "../controllers/inventory.controller.js";

const router = Router();

// Create inventory
router.post("/", create);

// Get inventory by product ID
router.get("/:productId", getByProductId);

// Get inventory by SKU
router.get("/:sku", getBySku);

// Update inventory
router.patch("/:productId", update);

// Add stock
router.post("/:productId/add", add);

// Remove stock
router.post("/:productId/remove", remove);

export default router;

