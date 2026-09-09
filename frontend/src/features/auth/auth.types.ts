export type AuthUser = { id: string; name: string; email: string; avatarUrl?: string }

export type LoginInput = { email: string; password: string }
export type RegisterInput = { name: string; email: string; password: string }
export type AuthResponse = { user: AuthUser; token: string }
