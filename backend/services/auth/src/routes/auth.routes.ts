import { Router } from "express";
import { login, logout, refresh, register, verifySession } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/** Creates a user account and establishes an authenticated session. */
router.post("/register", register);

/** Authenticates a user and establishes an authenticated session. */
router.post("/login", login);

/** Rotates the refresh token and issues a new access token. */
router.post("/refresh", refresh);

/** Revokes the current refresh token and clears authentication cookies. */
router.post("/logout", logout);

/** Returns the identity behind a valid access token (used by the gateway). */
router.get("/verify", authenticate, verifySession);

export default router;
