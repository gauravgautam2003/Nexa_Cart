import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { createProfile, getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/profile", authenticate, createProfile);
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile);

export default router;