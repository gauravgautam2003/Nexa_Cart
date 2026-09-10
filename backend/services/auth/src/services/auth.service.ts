import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { RegisterRequest, LoginRequest, AuthRequest } from "../types/auth.types.js";
import { ACCESS_TOKEN_MAX_AGE, generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_MAX_AGE } from "../config/token.js";

/**
 *  Sets access and refresh tokens as HTTP-only cookies. 
 */

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};

/**
 *  Creates, stores, and sets a new access and refresh token pair.
 */

const createTokenPair = async (userId: string, email: string, res: Response): Promise<string> => {
    const accessToken = generateAccessToken({ id: userId, email });
    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    });

    setAuthCookies(res, accessToken, refreshToken);
    return accessToken;
};

/** 
 * Validates, rotates, and replaces the current refresh token.
*/

export const refreshAccessToken = async (req: Request, res: Response): Promise<AuthRequest> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    const storedToken = await RefreshToken.findOne({
        tokenHash: hashToken(refreshToken),
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
        throw new Error("Invalid or expired refresh token");
    }

    const user = await User.findById(storedToken.userId);

    if (!user) {
        throw new Error("User not found");
    }

    storedToken.revokedAt = new Date();
    await storedToken.save();

    const accessToken = await createTokenPair(user.id.toString(), user.email, res);

    return {
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
        user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    };
};

/**
 *  Revokes the current refresh token and clears authentication cookies.
 */
 
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) {
        await RefreshToken.updateOne(
            { tokenHash: hashToken(refreshToken), revokedAt: { $exists: false } },
            { $set: { revokedAt: new Date() } },
        );
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
};

/** 
 * Creates a new user account and authenticates the user. 
 */

export const registerUser = async (data: RegisterRequest, res: Response): Promise<AuthRequest> => {
    const { name, email, password } = data;

    const existUser = await User.findOne({ email });

    if (existUser) {
        throw new Error("Email already exist")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashPassword
    })

    const accessToken = await createTokenPair(user.id.toString(), user.email, res);

    return {
        success: true,
        message: "User registered successfully",
        accessToken,
        user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    }
}

/** Validates user credentials and authenticates the user. */
export const LoginUser = async (data: LoginRequest, res: Response): Promise<AuthRequest> => {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
    }

    const accessToken = await createTokenPair(user.id.toString(), user.email, res);

    return {
        success: true,
        message: "Login successful",
        accessToken,
        user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    };
}