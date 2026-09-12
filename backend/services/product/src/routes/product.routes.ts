import { Router } from "express";
import {
    createProductController,
    deleteProductController,
    getProductController,
    listProductsController,
    updateProductController,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createProductController);
router.get("/", listProductsController);
router.get("/:id", getProductController);
router.patch("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;
