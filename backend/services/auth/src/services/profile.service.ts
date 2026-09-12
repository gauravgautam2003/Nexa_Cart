import UserProfile from "../models/profile.model.js";
import type { CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileResponse } from "../types/profile.types.js";


/**
 * @param data 
 * @description Creates a new user profile in the database.
 * @returns A promise that resolves to a UserProfileResponse object containing the created profile data.
 * @throws An error if a profile already exists for the given userId.
 */

export const createUserProfile = async (data: CreateUserProfileRequest): Promise<UserProfileResponse> => {

    const existingProfile = await UserProfile.findOne({
        userId: data.userId
    })

    if (existingProfile) {
        throw new Error("User profile already exists");
    }

    const profile = await UserProfile.create({
        userId: data.userId,
        phone: data.phone,
        avatar: data.avatar,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        addresses: data.addresses,
    })

    return {
        success: true,
        message: "User profile generated successfully",
        profile: {
            id: profile._id.toString(),
            userId: profile.userId.toString(),
            ...(profile.phone !== undefined && { phone: profile.phone }),
            ...(profile.avatar !== undefined && { avatar: profile.avatar }),
            ...(profile.dateOfBirth !== undefined && { dateOfBirth: profile.dateOfBirth }),
            ...(profile.gender !== undefined && { gender: profile.gender }),
            addresses: profile.addresses,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        }
    }
}

/**
 * @param userId The ID of the user for whom to retrieve the profile
 * @returns A promise that resolves to a UserProfileResponse object containing the user's profile data
 * @throws An error if a profile is not found for the given userId
 */

export const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
        throw new Error("User profile not found");
    }

    return {
        success: true,
        message: "User profile generated successfully",
        profile: {
            id: profile._id.toString(),
            userId: profile.userId.toString(),
            ...(profile.phone !== undefined && { phone: profile.phone }),
            ...(profile.avatar !== undefined && { avatar: profile.avatar }),
            ...(profile.dateOfBirth !== undefined && { dateOfBirth: profile.dateOfBirth }),
            ...(profile.gender !== undefined && { gender: profile.gender }),
            addresses: profile.addresses,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        }
    }
};

/**
 * Updates an existing user profile in the database.
 * @param userId The ID of the user for whom to update the profile
 * @param data The updated profile data
 * @returns A promise that resolves to a UserProfileResponse object containing the updated profile data
 * @throws An error if a profile is not found for the given userId
 */

export const updateUserProfile = async (userId: string, data: UpdateUserProfileRequest): Promise<UserProfileResponse> => {
    const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: data },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!profile) {
        throw new Error("User profile not found");
    }

    return {
        success: true,
        message: "User profile updated successfully",
        profile: {
            id: profile._id.toString(),
            userId: profile.userId.toString(),
            ...(profile.phone !== undefined && { phone: profile.phone }),
            ...(profile.avatar !== undefined && { avatar: profile.avatar }),
            ...(profile.dateOfBirth !== undefined && { dateOfBirth: profile.dateOfBirth }),
            ...(profile.gender !== undefined && { gender: profile.gender }),
            addresses: profile.addresses,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        }
    }
};

