import { Router } from "express";

import {
    create,
    getAll,
    getById,
    updateStatus,
    cancel,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getById);

router.patch("/:id/status", updateStatus);

router.patch("/:id/cancel", cancel);

export default router;