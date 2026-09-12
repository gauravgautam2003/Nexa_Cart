import type { NextFunction, Request, Response } from "express";
import {
    LoginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../services/auth.service.js";

/**
 *  Handles user registration requests. 
 */

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await registerUser(req.body, res);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
};

/**
 *  Handles user login requests.
 */

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await LoginUser(req.body, res);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};

/**
 *  Handles access-token refresh requests.
 */

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await refreshAccessToken(req, res);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};

/**
 *  Handles logout requests and token revocation. 
*/

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await logoutUser(req, res);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error)
    }
};