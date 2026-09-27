import { Router } from "express";
import { create, getUserNotificationsController, markAsRead, markAllAsRead, updateStatus } from "../controllers/notification.controller.js";

const router = Router();

router.post("/", create);

router.get("/user/:userId", getUserNotificationsController);
router.patch("/user/:userId/:notificationId/read", markAsRead);
router.patch("/user/:userId/read-all", markAllAsRead);
router.patch("/:notificationId/status", updateStatus);

export default router;