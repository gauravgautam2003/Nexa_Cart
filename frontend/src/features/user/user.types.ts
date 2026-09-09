export type UserProfile = { id: string; name: string; email: string; phone?: string; avatarUrl?: string }
export type Address = { id: string; label: string; line1: string; city: string; state?: string; postalCode: string; country: string; isDefault?: boolean }
