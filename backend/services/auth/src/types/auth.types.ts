import type { Request } from "express";

export interface RegisterRequest {
    name: string,
    email: string,
    password: string 
}

export interface LoginRequest {
    email: string,
    password: string
}

export interface AuthRequest {
    success: boolean;
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin";
        isVerified: boolean;
    };
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string,
        role: "user" | "admin"
    };
}