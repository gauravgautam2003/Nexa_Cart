import { createUserProfile, getUserProfile, updateUserProfile } from "../services/profile.service.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import type { NextFunction, Response } from "express";

/** Creates a profile for the authenticated user. */
export const createProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createUserProfile({ ...req.body, userId: req.user!.id });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/** Gets the profile for the authenticated user. */
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await getUserProfile(req.user!.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/** Updates the profile for the authenticated user. */
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await updateUserProfile(req.user!.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};