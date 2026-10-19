import { Router } from "express";
import { get, add, update, remove, clear } from "../controllers/cart.controller.js";
import { enrichCartItem } from "../middleware/cartItem.enrich.js";

const router = Router();

router.get("/", get);

// Item data is enriched from the product service before hitting the cart.
router.post("/items", enrichCartItem, add);

router.patch("/items/:productId", update);

router.delete("/items/:productId", remove);

router.delete("/clear", clear);

export default router;
