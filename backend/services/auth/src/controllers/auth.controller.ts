import type { Request, Response } from "express";
import {
    LoginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../services/auth.service.js";

/** Handles user registration requests. */
export const register = async (req: Request, res: Response): Promise<void> => {
    const result = await registerUser(req.body, res);
    res.status(201).json(result);
};

/** Handles user login requests. */
export const login = async (req: Request, res: Response): Promise<void> => {
    const result = await LoginUser(req.body, res);
    res.status(200).json(result);
};

/** Handles access-token refresh requests. */
export const refresh = async (req: Request, res: Response): Promise<void> => {
    const result = await refreshAccessToken(req, res);
    res.status(200).json(result);
};

/** Handles logout requests and token revocation. */
export const logout = async (req: Request, res: Response): Promise<void> => {
    await logoutUser(req, res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
};