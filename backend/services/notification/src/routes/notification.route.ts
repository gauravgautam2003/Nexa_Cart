import { Router } from "express";
import { create, getUserNotificationsController, markAsRead, markAllAsRead, updateStatus } from "../controllers/notification.controller.js";
import { requireSelfParam } from "../middleware/selfScope.middleware.js";

const router = Router();

// Internal: other services create notifications for their users.
router.post("/", create);

// User-facing: only the authenticated user may read their notifications.
router.get("/user/:userId", requireSelfParam, getUserNotificationsController);

router.patch("/user/:userId/:notificationId/read", requireSelfParam, markAsRead);

router.patch("/user/:userId/read-all", requireSelfParam, markAllAsRead);

router.patch("/:notificationId/status", updateStatus);

export default router;
