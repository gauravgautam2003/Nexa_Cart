export interface AddressInput {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
}

export interface CreateUserProfileRequest {
    userId: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: "male" | "female" | "other";
}

export interface UpdateUserProfileRequest {
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: "male" | "female" | "other";
    addresses?: AddressInput[];
}

export interface UserProfileResponse {
    success: boolean;
    message: string;
    profile?: {
        id: string;
        userId: string;
        phone?: string;
        avatar?: string;
        dateOfBirth?: Date;
        gender?: "male" | "female" | "other";
        addresses: AddressInput[];
        createdAt: Date;
        updatedAt: Date;
    }
}