import express from "express";
import { createProfile, getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const profileRoutes = express.Router();

/** Creates a profile for the authenticated user. */
profileRoutes.post("/create-profile", authenticate, createProfile)

/** Returns the profile belonging to the authenticated user. */
profileRoutes.get("/get-profile", authenticate, getProfile)

/** Updates profile fields for the authenticated user. */
profileRoutes.patch("/update-profile", authenticate, updateProfile)


export default profileRoutes