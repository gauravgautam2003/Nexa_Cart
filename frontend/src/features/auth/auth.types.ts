export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified?: boolean;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    accessToken?: string;
    user: User;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    /** "admin" creates an account that can manage the catalogue. */
    role?: "user" | "admin";
    /** Required with role "admin" — the server checks it against ADMIN_INVITE_CODE. */
    inviteCode?: string;
}
