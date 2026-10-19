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
}
