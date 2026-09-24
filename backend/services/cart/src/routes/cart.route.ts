import { Router } from "express";
import {get, add, update, remove, clear} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", get);
router.post("/items", add);
router.patch("/items/:productId", update);
router.delete("/items/:productId", remove);
router.delete("/clear", clear);

export default router;