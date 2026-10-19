import { Router } from "express";
import {
    createProductController,
    deleteProductController,
    getProductController,
    listCategoriesController,
    listProductsController,
    updateProductController,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createProductController);

router.get("/", listProductsController);

// Must be registered before `/:id` so it is not shadowed.
router.get("/categories", listCategoriesController);

router.get("/:id", getProductController);

router.patch("/:id", updateProductController);

router.delete("/:id", deleteProductController);

export default router;
