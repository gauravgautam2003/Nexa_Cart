import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export interface UserPayload {
    id: string,
    email: string
}

const SECRET_KEY: string = process.env.JWT_SECRET || "your-super-secret-key";
export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/** Generates a short-lived JWT for protected resource access. */
export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "15m" }
    )
}

/** Generates a cryptographically secure opaque refresh token. */
export const generateRefreshToken = (): string => crypto.randomBytes(64).toString("hex");

/** Hashes a token before database storage or lookup. */
export const hashToken = (token: string): string =>
    crypto.createHash("sha256").update(token).digest("hex");